"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Menu from "@/components/navbar";

type Template = {
  id: number;
  name: string;
};

const TemplateSelector: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const userId = "123";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Erro ao buscar templates");
        const data = await response.json();

        if (Array.isArray(data)) {
          setTemplates(data);
        } else {
          throw new Error("Formato de dados inválido.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleSelectTemplate = async (templateId: number) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, templateId }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.filePath) {
        alert(result.message);
        router.push("/Dashboard");
      } else {
        alert("Erro: Caminho do template não encontrado");
      }
    } else {
      alert("Erro ao salvar a escolha do template");
    }
  };

  return (
    <>
      <Menu />

      <>
        <Typography
          variant="h5"
          component="h1"
          align="center"
          fontWeight={600}
          mb={4}
          mt={4}
        >
          Selecione um Template
        </Typography>

        {error && (
          <Alert severity="error" sx={{ maxWidth: 600, mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack display="flex" justifyContent="center" mt={10}>
            <CircularProgress color="primary" size={48} />
          </Stack>
        ) : (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {templates.map((template) => (
              <Paper
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                elevation={3}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <Stack
                  width={150}
                  height={150}
                  borderRadius={4}
                  direction="row"
                  alignItems="center"
                  p={2}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                  >
                    {template.name}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </>
    </>
  );
};

export default TemplateSelector;
