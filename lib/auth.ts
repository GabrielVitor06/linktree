"use server";

import { users, NewUser, otps } from "@/lib/schema";
import db from "@/lib/db";
import { comparePassword, hashPassword, createSalt } from "@/lib/password";
import { cookies } from "next/headers";
import { createJWT, verifyJWT } from "@/lib/JWT";
import { z, ensureValidData } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { UnexpectedError } from "@/lib/error";
import { sendEmail } from "./email";
import { eq } from "drizzle-orm";

interface Session {
  [x: string]: unknown;
  id: unknown;
  users: {
    id: number;
    name: string;
    email: string;
    password: string;
  };
}

const oneDayInMs = 86400;
const thirdMinutesInMs = 1800;

const sessionLifetimeInS =
  process.env.NODE_ENV === "development" ? oneDayInMs : thirdMinutesInMs;

export async function getSession() {
  const sessionCookie = (await cookies()).get("session")?.value;

  if (!sessionCookie) {
    console.log("Nenhum cookie de sessão encontrado.");
    return null;
  }

  try {
    const decodedSession = await verifyJWT(sessionCookie);
    return decodedSession as unknown as Session;
  } catch (error) {
    console.error("Erro ao verificar o JWT:", error);
    return null;
  }
}

export async function renewSession(req: NextRequest, res: NextResponse) {
  const session = req.cookies.get("session")?.value;

  if (!session) {
    return;
  }

  try {
    res.cookies.set({
      name: "session",
      value: await createJWT(await verifyJWT(session), sessionLifetimeInS),
      maxAge: sessionLifetimeInS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  } catch {
    res.cookies.delete("session");
  }
}

export async function Signup(formData: FormData) {
  "use server";

  const password = formData.get("password");
  const email = formData.get("email");
  const name = formData.get("name");
  const salt = formData.get("salt");

  if (password === null || email === null || name === null) {
    console.log("Campos obrigatórios estão faltando.");
    return { success: false, error: "Required fields are missing." };
  }

  let hashedPassword: string;
  try {
    hashedPassword = await hashPassword(String(password));
  } catch (hashError) {
    console.error("Falha ao criptografar a senha:", hashError);
    return { success: false, error: "Failed to process password." };
  }

  let NewUser: NewUser | null = null;
  try {
    [NewUser] = (await db
      .insert(users)
      .values({
        email: String(email),
        name: name ? String(name) : null,
        password: hashedPassword,
        salt: String(salt),
        createdAt: new Date().toISOString(),
      })
      .returning()) as unknown as [NewUser];
  } catch (dbError) {
    console.error("Falha ao inserir usuário:", dbError);
    return { success: false, error: "Failed to register user." };
  }

  if (!NewUser) {
    console.log("Falha ao registrar o novo usuário.");
    return { success: false, error: "User registration failed." };
  }

  let jwt: string;
  try {
    jwt = await createJWT(
      {
        id: NewUser.id,
        name: NewUser.name,
        email: NewUser.email,
      },
      sessionLifetimeInS
    );
    console.log("JWT criado com sucesso:", jwt);
  } catch (jwtError) {
    console.error("Falha ao criar JWT:", jwtError);
    return { success: false, error: "Failed to create session." };
  }

  try {
    (await cookies()).set({
      name: "session",
      value: jwt,
      maxAge: sessionLifetimeInS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    console.log("Cookie de sessão configurado com sucesso.");
  } catch (cookieError) {
    console.error("Falha ao configurar cookie:", cookieError);
    return { success: false, error: "Failed to create session." };
  }

  return { success: true, error: null };
}

export async function SignIn(email: string, password: string) {
  "use server";

  ensureValidData(
    { email, password },
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  );

  try {
    console.log("Iniciando consulta no banco de dados...");

    const login = await db.query.users.findFirst({
      columns: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!login) {
      return { success: false, error: "Usuário não encontrado." };
    }
    const { password: storedHash, id, name } = login;

    const passwordMatch = await comparePassword(password, storedHash);
    if (!passwordMatch) {
      return { success: false, error: "Senha incorreta." };
    }

    const jwt = await createJWT({ id, name, email }, sessionLifetimeInS);

    (await cookies()).set({
      name: "session",
      value: jwt,
      maxAge: sessionLifetimeInS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Erro durante o processo de login", error);
    return { success: false, error: "Erro durante o processo de login." };
  }
}

export async function resetPassword(email: string) {
  ensureValidData({ email }, z.object({ email: z.string() }));

  let user;
  try {
    user = await db.query.users.findFirst({
      columns: { id: true },
      where: (users, { eq }) => eq(users.email, email),
    });
  } catch (error) {
    throw new UnexpectedError(
      "Não foi possível validar seu email devido a uma falha desconhecida. Tente novamente.",
      { cause: error }
    );
  }

  if (!user) {
    return btoa("0");
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));

  try {
    await db.insert(otps).values({
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      createdAt: new Date(),
    });
  } catch (error) {
    throw new UnexpectedError(
      "Não foi possível gerar seu código de segurança. Tente novamente.",
      { cause: error }
    );
  }

  try {
    await sendEmail(
      email,
      `${code} é seu código de segurança para redefinir sua senha do NTFit`,
      `<p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir sua senha do NTFit.</p>
        <p>Para completar o processo de redefinição, insira o seguinte código de segurança:<br />${code}</p>
        <p>Se você não solicitou a redefinição de senha, ignore este email.</p>`
    );
  } catch (error) {
    throw new UnexpectedError(
      "Não foi possível enviar o email com seu código de segurança. Tente novamente.",
      { cause: error }
    );
  }

  return btoa(String(user.id));
}

export async function confirmPasswordReset(
  obfuscatedUserId: string,
  securityCode: string,
  newPassword: string
) {
  let userId = 0;
  try {
    userId = Number(atob(obfuscatedUserId));
  } catch {}

  if (!userId) {
    // A random delay prevents the disclosure of a user's existence
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

    throw new Error("O código de segurança fornecido é inválido ou expirou");
  }

  ensureValidData(
    {
      userId,
      securityCode,
      newPassword,
    },
    z.object({
      userId: z.number(),
      securityCode: z.string(),
      newPassword: z.string().min(8),
    })
  );
  let otp;
  try {
    otp = await db.query.otps.findFirst({
      where: (otps, { eq, and }) =>
        and(eq(otps.userId, userId), eq(otps.code, securityCode)),
      orderBy: (otps, { desc }) => desc(otps.id),
    });
  } catch (error) {
    throw new UnexpectedError(
      "Não foi possível redefinir sua senha devido a uma falha desconhecida. Tente novamente.",
      { cause: error }
    );
  }

  if (!otp || new Date(otp.expiresAt) <= new Date()) {
    console.log("OTP expirado ou inválido");
    throw new Error("O código de segurança fornecido é inválido ou expirou");
  }

  try {
    await db.delete(otps).where(eq(otps.id, otp.id));
  } catch (error) {
    throw new UnexpectedError(
      "Não foi possível redefinir sua senha devido a uma falha ao processar seu código de segurança. Tente novamente.",
      { cause: error }
    );
  }

  const salt = createSalt();

  let hashedPassword;
  try {
    hashedPassword = await hashPassword(newPassword, salt);
  } catch (error) {
    throw new UnexpectedError(
      "Não foi possível criptografar sua senha. Tente novamente.",
      { cause: error }
    );
  }

  try {
    await db
      .update(users)
      .set({
        password: hashedPassword,
        salt,
      })
      .where(eq(users.id, userId));
  } catch (error) {
    throw new UnexpectedError(
      "Não foi possível redefinir sua senha devido a uma falha ao atualizar seu cadastro. Tente novamente.",
      { cause: error }
    );
  }

  let user;
  try {
    user = await db.query.users.findFirst({
      columns: { name: true, email: true },
      where: (users, { eq }) => eq(users.id, userId),
    });
  } catch (error) {
    throw new UnexpectedError(
      "Sua senha foi redefinida com sucesso. No entanto, não foi possível iniciar sua sessão automaticamente. Vá para a tela de entrada e faça login manualmente.",
      { cause: error }
    );
  }

  if (!user) {
    return;
  }

  let jwt;
  try {
    jwt = await createJWT(
      {
        user: {
          id: userId,
          name: user.name,
          email: user.email,
        },
      },
      sessionLifetimeInS
    );
  } catch (error) {
    throw new UnexpectedError(
      "Sua senha foi redefinida com sucesso. No entanto, não foi possível iniciar sua sessão automaticamente. Vá para a tela de entrada e faça login manualmente.",
      { cause: error }
    );
  }

  (await cookies()).set({
    name: "session",
    value: jwt,
    maxAge: sessionLifetimeInS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function signOut() {
  (await cookies()).delete("session");
}
