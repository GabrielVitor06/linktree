"use client";

import { SignIn } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password.trim()
    ) {
      setError("Email e senha devem ser fornecidos.");
      return;
    }

    setLoading(true);

    const result = await SignIn(email, password);
    setLoading(false);

    if (result.success) {
      router.push("/Dashboard");
    } else {
      setError(result.error || "Erro desconhecido.");
    }
  };

  return (
    <>
      <section className="flex justify-center items-center m-2">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded w-full max-w-2xl p-4"
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
              placeholder="Digite seu e-mail"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <div className=" flex">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Senha
              </label>
              <div className="flex-grow"></div>
              <Link
                href="/redefinir-senha"
                className="text-blue-500 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between mt-8">
            <Link href="/cadastro" className="text-blue-500 hover:underline">
              Não possui uma conta?
            </Link>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
