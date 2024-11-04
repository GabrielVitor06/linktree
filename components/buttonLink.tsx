"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserBySessionId } from "@/lib/publicActions";
import { getSession } from "@/lib/auth";

export default function FollowButton() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const session = await getSession();

        if (session && session.id) {
          const userId = Number(session.id);

          const user = await getUserBySessionId(userId);
          if (user && user.name) {
            setUsername(user.name);
          } else {
            setError("Nome do usuário não encontrado no banco de dados.");
          }
        } else {
          setError("Usuário não autenticado.");
        }
      } catch (err) {
        console.error("Erro ao buscar o nome do usuário:", err);
        setError("Erro ao buscar o nome do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!username) {
    return <p>Usuário não encontrado.</p>;
  }

  return (
    <div className=" flex justify-center">
      <Link href={`/${username}`}>
        <button className=" font-sans text-black lg:text-md xl:text-lg 2xl:text-xl">
          Tela {username}
        </button>
      </Link>
    </div>
  );
}
