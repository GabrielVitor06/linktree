"use client";
import React, { useEffect, useState } from "react";
import { Typography, Paper, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

type Template = {
  id: number;
  name: string;
};

const TemplateSelector: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
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
          console.log(err.message);
        } else {
          console.log("Ocorreu um erro desconhecido.");
        }
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
      <Typography variant="h5" component="h1" align="center" mb={4} mt={4}>
        Selecione um Template
      </Typography>
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
    </>
  );
};

export default TemplateSelector;
