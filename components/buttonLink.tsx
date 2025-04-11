"use client";

import { useEffect, useState } from "react";
import { getUserBySessionId } from "@/lib/publicActions";
import { getSession } from "@/lib/auth";
import { Box, Chip } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

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
      <Chip
        color="success"
        icon={<RemoveRedEyeIcon />}
        label="Ver"
        component="a"
        href={`/${username}`}
      />
    </Box>
  );
}
