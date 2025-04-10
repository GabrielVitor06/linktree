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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
      margin={2}
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
          Login
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
        />

        <Box display="flex" justifyContent="end" alignItems="center" mt={2}>
          <Link href="/redefinir-senha" style={{ color: "#1976d2" }}>
            Esqueceu a senha?
          </Link>
        </Box>

        <TextField
          fullWidth
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          size="small"
          required
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
          mt={4}
        >
          <Button href="/cadastro" style={{ color: "#1976d2" }}>
            Não possui uma conta?
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
