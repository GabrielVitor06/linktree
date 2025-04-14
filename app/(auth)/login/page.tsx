"use client";

import { SignIn } from "@/lib/auth";
import Link from "next/link";
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
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password.trim()
    ) {
      setError("Email e senha devem ser fornecidos.");
      return;
    }

    setLoading(true);

    const result = await SignIn(email, password);
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
        <Typography variant="h4" component="h2" textAlign="center" mb={4}>
          Bem-vindo de volta
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="E-mail"
          name="email"
          type="email"
          required
          size="small"
          margin="normal"
        />

        <TextField
          fullWidth
          name="password"
          type={showPassword ? "text" : "password"}
          label="Senha"
          size="small"
          required
          margin="normal"
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

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
          mb={3}
        >
          <Link
            href="/redefinir-senha"
            style={{ color: "#1976d2", fontSize: "0.875rem" }}
          >
            Esqueceu a senha?
          </Link>
          <Link
            href="/cadastro"
            style={{ color: "#1976d2", fontSize: "0.875rem" }}
          >
            Criar conta
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          size="large"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>

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
      </Box>
    </Box>
  );
}
