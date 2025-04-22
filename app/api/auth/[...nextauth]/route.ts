import NextAuth from "next-auth";
import { authOptions } from "@/lib/authGoogle";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
