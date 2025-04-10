"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserBySessionId } from "@/lib/publicActions";
import { getSession } from "@/lib/auth";
import { FaTabletScreenButton } from "react-icons/fa6";
import { Box, Button } from "@mui/material";

export default function FollowButton() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const session = await getSession();

        if (session?.id) {
          const userId = Number(session.id);
          const user = await getUserBySessionId(userId);

          if (user?.name) {
            setUsername(user.name);
          } else {
            console.log("Nome do usuário não encontrado.");
          }
        } else {
          console.log("Usuário não autenticado.");
        }
      } catch (err) {
        console.error("Erro ao buscar o nome do usuário:", err);
        console.log("Erro ao buscar o nome do usuário.");
      }
    };

    fetchUsername();
  }, []);

  return (
    <Box display="flex" justifyContent="center">
      <Link href={`/${username}`} passHref>
        <Button
          variant="text"
          color="inherit"
          startIcon={<FaTabletScreenButton />}
        >
          Sua tela
        </Button>
      </Link>
    </Box>
  );
}
