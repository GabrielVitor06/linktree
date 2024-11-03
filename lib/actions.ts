/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { forms, NewForm, users, NewUser, titles, NewTitle } from "@/lib/schema";
import db from "@/lib/db";
import { comparePassword, hashPassword } from "@/lib/password";
import { cookies } from "next/headers";
import { createJWT, verifyJWT } from "@/lib/JWT";
import { z, ensureValidData } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

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
    console.error("Erro ao verificar o JWT:", error); // Log do erro
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

export async function linktree(formData: FormData) {
  "use server";

  // Obtendo a sessão do usuário
  const session = await getSession();

  const url = formData.get("url");
  const text = formData.get("text");
  const platforms = formData.getAll("platforms") as string[];

  if (url === null || text === null) {
    return { success: false, error: "Required fields are missing." };
  }

  // Verifique se a sessão existe e se contém um ID de usuário
  if (!session || !session.id) {
    return { success: false, error: "User not authenticated." };
  }

  const userId = Number(session.id);

  // Inserindo links
  let NewForm: NewForm | null = null;
  try {
    [NewForm] = (await db
      .insert(forms)
      .values({
        userId: userId, // Define o userId aqui
        url: String(formData.get("url")),
        text: String(formData.get("text")),
        platforms: platforms.join(","),
      })
      .returning()) as unknown as [NewForm];
  } catch (dbError) {
    console.error("Failed to insert user", dbError);
    return { success: false, error: "Failed to register user." };
  }

  // Verificação se o formulário foi criado corretamente
  if (!NewForm) {
    return { success: false, error: "User registration failed." };
  }

  // Sucesso ao criar o formulário
  return { success: true, data: NewForm };
}

export async function Titles(formData: FormData) {
  "use server";

  // Obtendo a sessão do usuário
  const session = await getSession();

  // Verifique se a sessão existe e se contém um ID de usuário
  if (!session || !session.id) {
    return { success: false, error: "User not authenticated." };
  }

  const userId = Number(session.id);

  // Inserindo titulos
  let NewTitle: NewForm | null = null;
  try {
    [NewTitle] = (await db
      .insert(titles)
      .values({
        userId: userId, // Define o userId aqui
        title: String(formData.get("title")),
        subtitulo: String(formData.get("subtitulo")),
        imageUrl: String(formData.get("imageUrl")),
      })
      .returning()) as unknown as [NewForm];
  } catch (dbError) {
    console.error("Failed to insert user", dbError);
    return { success: false, error: "Failed to register user." };
  }

  // Verificação se o formulário foi criado corretamente
  if (!NewTitle) {
    return { success: false, error: "User registration failed." };
  }

  // Sucesso ao criar o formulário
  return { success: true, data: NewTitle };
}

export async function Signup(formData: FormData) {
  "use server";

  // Obter e verificar valores do formulário
  const password = formData.get("password");
  const email = formData.get("email");
  const name = formData.get("name");

  if (password === null || email === null || name === null) {
    return { success: false, error: "Required fields are missing." };
  }

  // Hash de senha
  let hashedPassword: string;
  try {
    hashedPassword = await hashPassword(String(password));
  } catch (hashError) {
    console.error("Failed to hash password", hashError);
    return { success: false, error: "Failed to process password." };
  }

  // Inserindo usuário
  let NewUser: NewUser | null = null;
  try {
    [NewUser] = (await db
      .insert(users)
      .values({
        email: String(email),
        name: name ? String(name) : null,
        password: hashedPassword,
      })
      .returning()) as unknown as [NewUser];
  } catch (dbError) {
    console.error("Failed to insert user", dbError);
    return { success: false, error: "Failed to register user." };
  }

  if (!NewUser) {
    return { success: false, error: "User registration failed." };
  }

  // Gerar JWT
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
  } catch (jwtError) {
    console.error("Failed to create JWT", jwtError);
    return { success: false, error: "Failed to create session." };
  }

  // Definir cookie
  try {
    (await cookies()).set({
      name: "session",
      value: jwt,
      maxAge: sessionLifetimeInS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  } catch (cookieError) {
    console.error("Failed to set cookie", cookieError);
    return { success: false, error: "Failed to create session." };
  }

  return { sucess: true, error: null };
}

export async function SignIn(email: string, password: string) {
  "use server";

  // Validação dos dados de entrada
  ensureValidData(
    { email, password },
    z.object({
      email: z.string().email(), // Validação do email
      password: z.string().min(6), // Validação da senha
    })
  );

  try {
    console.log("Iniciando consulta no banco de dados...");

    // Consultando o usuário pelo email usando query
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

    // Recupera os dados do usuário do banco de dados
    const { password: storedHash, id, name } = login;

    // Comparando a senha
    const passwordMatch = await comparePassword(password, storedHash);
    if (!passwordMatch) {
      return { success: false, error: "Senha incorreta." };
    }

    // Gerar JWT
    const jwt = await createJWT({ id, name, email }, sessionLifetimeInS);

    // Definir cookie
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

export async function signOut() {
  (await cookies()).delete("session");
}
