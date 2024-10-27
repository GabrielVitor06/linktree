"use client";

import { SignIn } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Cadastro() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const formData = new FormData(event.currentTarget);
  //   const email = formData.get("email");
  //   const password = formData.get("password");

  //   // Verifique se o email e a senha não são nulos
  //   if (typeof email !== "string" || typeof password !== "string") {
  //     setError("Email e senha devem ser fornecidos.");
  //     return;
  //   }

  //   console.log("Email:", email);
  //   console.log("Senha:", password);

  //   const result = await SignIn(email, password);

  //   if (result.success) {
  //     router.push("/(auth)/login");
  //   } else {
  //     setError(result.error);
  //   }
  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // Verifique se o email e a senha não são nulos ou vazios
    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password.trim()
    ) {
      setError("Email e senha devem ser fornecidos.");
      return;
    }

    console.log("Email:", email);
    console.log("Senha:", password);

    const result = await SignIn(email, password);

    if (result.success) {
      router.push("/Dashboard");
    } else {
      setError(result.error || "Erro desconhecido.");
    }
  };

  return (
    <>
      <section className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <Link href="/cadastro" className="text-blue-500 hover:underline">
              Não possui uma conta?
            </Link>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Entrar
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
