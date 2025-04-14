"use client";

import { Signup } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";
import { signIn } from "next-auth/react";

export default function Cadastro() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    const result = await Signup(formData);
    setLoading(false);

    if (result.success) {
      router.push("/Dashboard");
    } else {
      setError(result.error || "Erro desconhecido.");
    }
  };

  return (
    <Box
      component="section"
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding={2}
      mt={12}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        bgcolor="white"
        boxShadow={3}
        borderRadius={2}
        p={4}
        width="100%"
        maxWidth="600px"
      >
        <Typography variant="h4" component="h2" textAlign="center" mb={3}>
          Cadastro
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Nome"
          name="name"
          type="text"
          required
          margin="normal"
          size="small"
          autoComplete="name"
        />

        <TextField
          fullWidth
          label="E-mail"
          name="email"
          type="email"
          required
          margin="normal"
          size="small"
          autoComplete="email"
        />

        <TextField
          fullWidth
          label="Senha"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          margin="normal"
          size="small"
          placeholder="Digite sua senha"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Divider sx={{ my: 3 }}>ou</Divider>

        <Button
          onClick={() => signIn("google", { callbackUrl: "/Dashboard" })}
          variant="outlined"
          fullWidth
          color="inherit"
          sx={{ mb: 2 }}
          startIcon={<Google />}
        >
          Cadastrar com o Google
        </Button>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Button href="/" style={{ color: "#1976d2" }}>
            Já possui uma conta?
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
