import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/lib/db";
import { users } from "@/lib/schema";
import { createJWT } from "@/lib/JWT";
import { cookies } from "next/headers";

// Defina o tipo do usuário
interface IUser {
  id: number;
  name: string | null;
  email: string;
  password: string;
  salt: string;
  createdAt: string;
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: unknown }) {
      const { email, name } = user as IUser;

      if (!email) {
        console.error("E-mail do Google não encontrado.");
        return false;
      }

      // Verifica se o usuário já existe
      let existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
        columns: {
          id: true,
          name: true,
          email: true,
        },
      });

      // Se não existir, cria
      if (!existingUser) {
        try {
          [existingUser] = (await db
            .insert(users)
            .values({
              email,
              name: name ?? "",
              password: "", // pode deixar vazio
              salt: "",
              createdAt: new Date().toISOString(),
            })
            .returning()) as unknown as [IUser];
          console.log("Usuário criado com sucesso via Google:", email);
        } catch (error) {
          console.error("Erro ao criar usuário via Google:", error);
          return false;
        }
      }

      // Define o tempo de vida da sessão em segundos
      const sessionLifetimeInS = 60 * 60 * 24; // 1 dia

      // Cria o JWT manualmente
      try {
        const jwt = await createJWT(
          {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
          },
          sessionLifetimeInS
        );

        (await cookies()).set({
          name: "session",
          value: jwt,
          maxAge: sessionLifetimeInS,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        console.log("JWT e cookie criados com sucesso via Google login.");
      } catch (error) {
        console.error("Erro ao criar JWT/cookie via Google:", error);
        return false;
      }

      return true;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt" as SessionStrategy,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
