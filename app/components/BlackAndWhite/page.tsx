// pages/black-white.tsx
import { FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import db from "@/lib/db";
import { forms, users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const revalidate = 10;

export async function getServer({ params }: { params: { name: string } }) {
  console.log("Params:", params.name);

  const user = await db
    .select({
      id: users.id,
      username: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.name, params.name))
    .get();

  if (!user) {
    return { notFound: true };
  }

  const userLinks = await db
    .select({
      id: forms.id,
      title: forms.text,
      url: forms.url,
    })
    .from(forms)
    .where(eq(forms.userId, user.id))
    .all();

  return { props: { user, userLinks } };
}

// Componente de renderização
export default function BlackWhiteTemplate({
  // user,
  userLinks,
}: {
  user: { id: number; name: string; email: string };
  userLinks: { id: number; title: string; url: string }[];
}) {
  return (
    <div className="min-h-screen bg-black flex justify-center items-center ">
      {/* <h1>{user.name}</h1> */}
      {userLinks.map((link) => (
        <div
          key={link.id}
          className="w-full max-w-xl m-6 text-white flex flex-col items-center justify-center p-24 rounded-2xl bg-white bg-opacity-10 backdrop-blur-md"
        >
          <Image
            className="w-24 h-24 rounded-full"
            src="/avatar.jpg"
            alt="Profile Avatar"
            width={150}
            height={150}
          />
          <h1 className="mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
            {link.title}
          </h1>
          <p className="text-gray-400">Creative Developer</p>

          <div className="mt-12 space-y-8 w-full max-w-xs text-black text-md sm:text-lg md:text-xl lg:text-2xl">
            <Link
              href={link.url}
              className="block w-full bg-zinc-300 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
            >
              Portfolio
            </Link>
            <Link
              href="#"
              className="block w-full bg-zinc-300 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
            >
              Contact
            </Link>
            <Link
              href="#"
              className="block w-full bg-zinc-300 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
            >
              LinkedIn
            </Link>
            <Link
              href="#"
              className="block w-full bg-zinc-300 py-3 rounded-2xl text-center font-semibold hover:bg-gray-300"
            >
              Loja
            </Link>
          </div>

          <div className="mt-16 flex space-x-4">
            <FaInstagram className="w-6 h-6" />
            <FaTwitter className="w-6 h-6" />
            <FaGithub className="w-6 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
}
