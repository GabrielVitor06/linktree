/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useApp } from "@/hook/useApp";
import { Stack, Typography, Avatar, Button } from "@mui/material";
import { purple } from "@mui/material/colors";
import {
  Twitter,
  LinkedIn,
  WhatsApp,
  Facebook,
  Instagram,
} from "@mui/icons-material";

interface UserLink {
  id: string;
  url: string;
  text: string;
  platforms: string;
}

export default function ProfessionalTemplate() {
  const { username } = useParams();
  const { getUserId, getUserLinks, getTitles } = useApp();

  const [links, setLinks] = useState<UserLink[]>([]);
  const [userTitle, setUserTitle] = useState<string | null>(null);
  const [userSubTitle, setUserSubTitle] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async (username: string) => {
      const userId = await getUserId(username);

      if (!userId) {
        console.error("User ID is null");
        return;
      }

      const [userLinks, titles] = await Promise.all([
        getUserLinks(userId),
        getTitles(),
      ]);

      const formattedLinks =
        userLinks?.map((link) => ({
          ...link,
          id: link.id.toString(),
        })) || [];

      setLinks(formattedLinks);

      if (titles && titles[0]) {
        const { title, subtitulo, imageUrl } = titles[0];
        setUserTitle(title);
        setUserSubTitle(subtitulo);
        setImageUrl(imageUrl);
      }
    };

    if (typeof username === "string") {
      fetchUserData(username);
    }
  }, [username, getUserId, getUserLinks, getTitles]);

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
        background: "linear-gradient(to bottom right, #0d0d0d, #1c1c1c)",
      }}
    >
      <Avatar
        src={imageUrl || ""}
        alt="Profile Avatar"
        sx={{
          width: { xs: 104, lg: 124, xl: 132 },
          height: { xs: 104, lg: 124, xl: 132 },
          bgcolor: purple[500],
          border: "1px solid purple",
          boxShadow: 2,
        }}
      />

      <Stack textAlign="center">
        <Typography variant="h5" color="white" fontWeight={600}>
          {userTitle}
        </Typography>
        <Typography variant="subtitle1" color="grey.400">
          {userSubTitle}
        </Typography>
      </Stack>

      <Stack spacing={3} width="80%" maxWidth={400}>
        {links.map((link) => (
          <Button
            key={link.id}
            href={link.url}
            startIcon={getIcon(link.platforms)}
            variant="contained"
            color="secondary"
            sx={{
              textTransform: "capitalize",
              fontWeight: 500,
            }}
          >
            {link.text}
          </Button>
        ))}
      </Stack>

      <Typography variant="h6" color="white">
        Linktree
      </Typography>
    </Stack>
  );
}
