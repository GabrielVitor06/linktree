import { AuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/lib/db";
import { users } from "@/lib/schema";
import { createJWT } from "@/lib/JWT";
import { cookies } from "next/headers";

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

      if (!email) return false;

      let existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
        columns: { id: true, name: true, email: true },
      });

      if (!existingUser) {
        [existingUser] = (await db
          .insert(users)
          .values({
            email,
            name: name ?? "",
            password: "",
            salt: "",
            createdAt: new Date().toISOString(),
          })
          .returning()) as unknown as [IUser];
      }

      const sessionLifetimeInS = 60 * 60 * 24;

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
