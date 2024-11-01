// import Link from "next/link";

// export default function FollowButton({ username }: { username: string }) {
//   return (
//     <Link href={`/${username}`}>
//       <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
//         Ver perfil de {username}
//       </button>
//     </Link>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserBySessionId } from "@/lib/publicActions"; // Ajuste o caminho conforme necessário
import { getSession } from "@/lib/actions"; // Função para obter a sessão

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

          // Busca o usuário a partir do ID da sessão
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
    <div className="flex justify-center">
      <Link href={`/${username}`}>
        <button className=" text-white  bg-sky-400 hover:bg-sky-500 w-full max-w-2xl p-2 rounded-lg lg:text-lg xl:text-xl 2xl:text-2xl  font-bold">
          Ver perfil de {username}
        </button>
      </Link>
    </div>
  );
}
