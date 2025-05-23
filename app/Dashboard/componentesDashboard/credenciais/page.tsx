"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Stack,
  TextField,
  FormControl,
  Alert,
  FormLabel,
  FormControlLabel,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Link,
  RadioGroup,
  Radio,
} from "@mui/material";
import {
  Twitter,
  LinkedIn,
  WhatsApp,
  Facebook,
  Instagram,
  GitHub,
  Edit,
  Delete,
  Save,
  Cancel,
} from "@mui/icons-material";
import { useApp } from "@/hook/useApp";

const platforms = [
  { name: "Twitter", icon: <Twitter color="primary" /> },
  { name: "LinkedIn", icon: <LinkedIn sx={{ color: "#0a66c2" }} /> },
  { name: "WhatsApp", icon: <WhatsApp sx={{ color: "#25D366" }} /> },
  { name: "Facebook", icon: <Facebook color="primary" /> },
  { name: "Instagram", icon: <Instagram sx={{ color: "#E1306C" }} /> },
  { name: "GitHub", icon: <GitHub sx={{ color: "#000" }} /> },
];

interface Link {
  id: number;
  text: string;
  url: string;
  platforms?: string;
}

export default function LinkTree() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Link>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const { userId, createLink, getUserLinks, removeLink, updateLink, errorMap } =
    useApp();

  useEffect(() => {
    const fetchLinks = async () => {
      if (!userId) return;
      const result = await getUserLinks(userId);
      if (result) setLinks(result);
      else setError(errorMap.getUserLinks || "Erro ao carregar links.");
    };
    fetchLinks();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("platforms", selectedPlatforms);

    const result = await createLink(formData);
    if (result && result.success && result.data) {
      const link = result.data as Link;

      if (
        typeof link.id === "number" &&
        typeof link.text === "string" &&
        typeof link.url === "string"
      ) {
        setLinks((prev) => [...prev, link]);
        setMessage("Link enviado com sucesso!");
        setError(null);
        formRef.current?.reset();
      } else {
        setError("Ocorreu um erro ao processar os dados do link.");
      }
    } else {
      setError(
        result?.error ||
          errorMap.createLink ||
          "Ocorreu um erro. Tente novamente."
      );
      setMessage(null);
    }
  };

  const handleDelete = async (id: number) => {
    await removeLink(id);
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const handleEdit = (link: Link) => {
    setEditingId(link.id);
    setEditValues(link);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSave = async () => {
    if (!editingId || !editValues.text || !editValues.url) {
      setError("Preencha todos os campos para salvar.");
      return;
    }

    await updateLink(editingId, {
      text: editValues.text,
      url: editValues.url,
      platforms: editValues.platforms || "",
    });

    setLinks((prev) =>
      prev.map((link) =>
        link.id === editingId ? { ...link, ...editValues } : link
      )
    );
    handleCancel();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Links</Typography>

      <Stack component="form" spacing={3} onSubmit={handleSubmit} ref={formRef}>
        <TextField
          name="text"
          label="Texto"
          variant="standard"
          fullWidth
          required
        />
        <TextField
          name="url"
          label="URL"
          variant="standard"
          fullWidth
          required
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Escolha as plataformas:</FormLabel>
          <RadioGroup
            row
            value={selectedPlatforms}
            onChange={(e) => setSelectedPlatforms(e.target.value)}
          >
            {platforms.map(({ name, icon }) => (
              <FormControlLabel
                key={name}
                value={name}
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {icon}
                    <span>{name}</span>
                  </Stack>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Button variant="contained" fullWidth type="submit">
          Enviar
        </Button>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <List sx={{ mt: 1, maxHeight: 300, overflowY: "auto" }}>
        {links.length > 0 ? (
          links.map((link) => {
            const isEditing = editingId === link.id;
            const { text, url } = editValues;

            const platform = platforms.find((p) => p.name === link.platforms);
            const icon = platform?.icon;

            return (
              <ListItem disablePadding key={link.id}>
                {isEditing ? (
                  <Stack direction="column" spacing={2} width="100%">
                    <TextField
                      size="small"
                      label="Texto"
                      value={text}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      fullWidth
                      required
                    />
                    <TextField
                      size="small"
                      label="URL"
                      value={url}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                      fullWidth
                    />
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={handleSave}>
                        <Save color="warning" />
                      </IconButton>
                      <IconButton onClick={handleCancel}>
                        <Cancel color="error" />
                      </IconButton>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {icon}
                          <span>{link.text}</span>
                        </Stack>
                      }
                      secondary={
                        <Link
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.url}
                        </Link>
                      }
                    />
                    <Stack direction="row">
                      <IconButton onClick={() => handleEdit(link)}>
                        <Edit color="warning" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(link.id)}>
                        <Delete color="error" />
                      </IconButton>
                    </Stack>
                  </Stack>
                )}
              </ListItem>
            );
          })
        ) : (
          <Typography variant="body2" color="textSecondary">
            Nenhum link adicionado.
          </Typography>
        )}
      </List>
    </Paper>
  );
}
