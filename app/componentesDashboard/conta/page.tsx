"use client";

import React, { useEffect, useState } from "react";
import { getSession, signOut } from "@/lib/auth";
import { fetchUserData } from "@/lib/actions";
import Menu from "@/components/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string | null;
  email: string;
  password: string;
} | null;

export default function Conta() {
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);

      const session = await getSession();

      if (session && session.id) {
        const userId = Number(session.id);
        try {
          const userData = await fetchUserData(userId);
          setUser(userData);
        } catch {
          setError("Erro ao buscar dados do usuário.");
        }
      } else {
        setError("Usuário não autenticado.");
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   console.log("Formulário enviado para editar dados do usuário:", user);
  // };
  // onSubmit={handleSubmit}

  const handleSignOut = async () => {
    await signOut();
    router.push("/login"); // Redireciona para a página de login
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Nenhum dado do usuário encontrado.</p>;

  return (
    <>
      <Menu />
      <br />
      <div className="flex justify-center items-center min-h-screen">
        <div className="max-w-md mx-auto p-4 -mt-32 ">
          <h1 className="text-2xl font-semibold mb-4">Perfil do Usuário</h1>
          <form className="mt-10">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                value={user.name || ""}
                className="mt-1 p-2 border rounded w-full"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                className="mt-1 p-2 border rounded w-full"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                value="••••••••"
                className="mt-1 p-2 border rounded w-full"
                readOnly
              />
              <Link
                className="text-blue-600 underline"
                href={"/redefinir-senha"}
              >
                Redefinir senha
              </Link>
            </div>
          </form>
          <button onClick={handleSignOut} className="mt-4 p-2  rounded">
            Sair
          </button>
        </div>
      </div>
    </>
  );
}
