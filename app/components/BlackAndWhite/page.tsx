/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  Twitter,
  LinkedIn,
  WhatsApp,
  Facebook,
  Instagram,
} from "@mui/icons-material";
import { useApp } from "@/hook/useApp";
import { Stack, Typography, Avatar, Button } from "@mui/material";

interface UserLink {
  id: string;
  url: string;
  text: string;
  platforms: string;
}

export default function ProfessionalTemplate() {
  const { getUserLinks, getTitles, userId } = useApp();

  const [links, setLinks] = useState<UserLink[]>([]);
  const [title, setTitle] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const [userLinks, userTitles] = await Promise.all([
          getUserLinks(userId),
          getTitles(),
        ]);

        if (userLinks?.length) {
          const formattedLinks = userLinks.map((link) => ({
            ...link,
            id: link.id.toString(),
          }));
          setLinks(formattedLinks);
        }

        if (userTitles?.length) {
          const { title, subtitulo, imageUrl } = userTitles[0];
          setTitle(title || "");
          setSubtitulo(subtitulo || "");
          setImageUrl(imageUrl || "");
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchData();
  }, [userId]);

  const getIcon = (platform: string) => {
    const icons: Record<string, JSX.Element> = {
      Twitter: <Twitter />,
      LinkedIn: <LinkedIn />,
      WhatsApp: <WhatsApp />,
      Facebook: <Facebook />,
      Instagram: <Instagram />,
    };
    return icons[platform] || null;
  };

  return (
    <Stack
      spacing={4}
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        background: "linear-gradient(to bottom right, #000000, #1a1a1a)",
      }}
    >
      <Avatar
        src={imageUrl}
        alt="Profile Avatar"
        sx={{
          width: { xs: 104, lg: 124, xl: 132 },
          height: { xs: 104, lg: 124, xl: 132 },
          bgcolor: "white",
          border: `1px solid blue`,
          boxShadow: 1,
        }}
      />

      <Stack textAlign="center">
        <Typography variant="h5" color="white" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="subtitle1" color="grey.400">
          {subtitulo}
        </Typography>
      </Stack>

      <Stack spacing={2} width="80%" maxWidth={400}>
        {links.map((link) => (
          <Button
            key={link.id}
            href={link.url}
            startIcon={getIcon(link.platforms)}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              textTransform: "capitalize",
              fontWeight: 500,
            }}
          >
            {link.text}
          </Button>
        ))}
      </Stack>

      <Typography variant="h6" color="white" mt={4}>
        Linktree
      </Typography>
    </Stack>
  );
}
