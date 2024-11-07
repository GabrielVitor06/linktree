"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "@/lib/auth"; // Ajuste conforme sua implementação de autenticação
import { fetchUserData } from "@/lib/actions";
import Menu from "@/components/navbar";
import Link from "next/link";

// Definindo o tipo User
type User = {
  id: number;
  name: string | null;
  email: string;
  password: string;
} | null;

export default function Conta() {
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true); // Começa o carregamento

      const session = await getSession();

      if (session && session.id) {
        const userId = Number(session.id);
        try {
          const userData = await fetchUserData(userId);
          setUser(userData);
        } catch (err: any) {
          setError("Erro ao buscar dados do usuário.");
        }
      } else {
        setError("Usuário não autenticado.");
      }
      setLoading(false); // Finaliza o carregamento
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Lógica para editar os dados do usuário
    console.log("Formulário enviado para editar dados do usuário:", user);
  };

  if (loading) return <p>Carregando...</p>; // Mensagem de carregamento
  if (error) return <p className="text-red-500">{error}</p>; // Mensagem de erro
  if (!user) return <p>Nenhum dado do usuário encontrado.</p>; // Caso não encontre o usuário

  return (
    <>
      <Menu />
      <br />
      <div className="flex justify-center items-center min-h-screen">
        <div className="max-w-md mx-auto p-4 -mt-32 ">
          <h1 className="text-2xl font-semibold mb-4">Perfil do Usuário</h1>
          <form onSubmit={handleSubmit} className="mt-10">
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
                value="••••••••" // Exibir como bolinhas
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
        </div>
      </div>
    </>
  );
}
