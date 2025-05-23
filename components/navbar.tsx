"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import FollowButton from "./buttonLink";
import { getSession, signOut } from "@/lib/auth";
import { fetchUserData } from "@/lib/actions";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link as MuiLink,
  Stack,
} from "@mui/material";

type User = {
  id: number;
  name: string | null;
  email: string;
  password: string;
} | null;

export default function Menu() {
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const toggleSettingsDrawer = () => {
    setSettingsDrawerOpen(!settingsDrawerOpen);
  };

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

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box mt={4} textAlign="center">
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!user)
    return (
      <Box mt={4} textAlign="center">
        <Typography>Nenhum dado do usuário encontrado.</Typography>
      </Box>
    );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Linktree</Typography>
          <Stack direction="row" gap={3}>
            <FollowButton />
            <IconButton
              onClick={toggleSettingsDrawer}
              edge="end"
              color="inherit"
            >
              <Settings />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={settingsDrawerOpen}
        onClose={toggleSettingsDrawer}
      >
        <Stack width={300} p={2}>
          <Typography variant="h5">Perfil do Usuário</Typography>

          <Box component="form" noValidate autoComplete="off" mt={3}>
            <TextField
              label="Nome"
              value={user.name || ""}
              fullWidth
              margin="normal"
              size="small"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={user.email}
              fullWidth
              margin="normal"
              size="small"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
            <TextField
              label="Senha"
              type="password"
              value="••••••••"
              fullWidth
              margin="normal"
              size="small"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            <Box mt={1}>
              <MuiLink
                component={Link}
                href="/redefinir-senha"
                underline="hover"
                color="primary"
                fontSize={14}
              >
                Redefinir senha
              </MuiLink>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button variant="contained" color="error" onClick={handleSignOut}>
                Sair
              </Button>
            </Box>
          </Box>
        </Stack>
      </Drawer>

      <Toolbar />
    </>
  );
}
