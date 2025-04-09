"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Stack,
  TextField,
  FormControl,
  Alert,
  Paper,
  Typography,
} from "@mui/material";

import { useApp } from "@/hook/useApp";

export default function Subcredenciais() {
  const { getTitles, createTitle, updateTitle, loadingMap, errorMap, userId } =
    useApp();

  const [title, setTitle] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTitleId, setCurrentTitleId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTitles = async () => {
      if (!userId) return;

      const userTitles = await getTitles();
      if (userTitles && userTitles.length > 0) {
        const t = userTitles[0];
        setIsEditMode(true);
        setCurrentTitleId(t.id);
        setTitle(t.title || "");
        setSubtitulo(t.subtitulo || "");
        setImageUrl(t.imageUrl || "");
      }
    };

    fetchTitles();
  }, [userId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      if (isEditMode && currentTitleId) {
        const result = await updateTitle(currentTitleId, { title, subtitulo });

        if (result) {
          setMessage("Título editado com sucesso!");
        } else {
          setError("Erro ao editar título.");
        }
      } else {
        const formData = new FormData(event.currentTarget);
        formData.set("imageUrl", imageUrl); // Garantir envio da imagem
        const result = await createTitle(formData);

        if (result) {
          setMessage("Título enviado com sucesso!");
        } else {
          setError("Erro ao enviar título.");
        }
      }
    } catch (err) {
      console.error("Erro ao processar ação:", err);
      setError("Erro inesperado ao processar.");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Títulos</Typography>
      <Stack component="form" width={400} spacing={4} onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <TextField
            name="title"
            label="Título"
            placeholder="Digite seu título"
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            name="subtitulo"
            label="Subtítulo"
            placeholder="Digite seu subtítulo"
            variant="standard"
            sx={{ mt: 2 }}
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
          />
          <TextField
            name="imageUrl"
            label="Imagem URL"
            placeholder="Digite a URL da imagem"
            variant="standard"
            sx={{ mt: 2 }}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={loadingMap.createTitle || loadingMap.updateTitle}
        >
          {isEditMode ? "Atualizar" : "Enviar"}
        </Button>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {errorMap.getTitles && (
          <Alert severity="error">{errorMap.getTitles}</Alert>
        )}
      </Stack>
    </Paper>
  );
}
