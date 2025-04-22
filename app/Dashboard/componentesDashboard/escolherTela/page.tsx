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
        spacing={3}
        flexWrap="wrap"
      >
        {templates.map((template) => (
          <Paper
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            elevation={4}
            sx={{
              width: 180,
              height: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: 4,
              bgcolor: "background.paper",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.06)",
                boxShadow: 8,
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                textAlign: "center",
                px: 2,
              }}
            >
              {template.name}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </>
  );
};

export default TemplateSelector;
