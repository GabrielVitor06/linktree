"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Stack,
  TextField,
  FormControl,
  Alert,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Link,
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
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Link>>({});

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
    selectedPlatforms.forEach((p) => formData.append("platforms", p));

    const result = await createLink(formData);

    if (result) {
      setMessage("Link enviado com sucesso!");
      setError(null);
      if ("id" in result && "text" in result && "url" in result) {
        if (
          typeof result.id === "number" &&
          typeof result.text === "string" &&
          typeof result.url === "string"
        ) {
          setLinks((prev) => [...prev, result as Link]); // ⬅️ Atualiza o estado localmente
        } else {
          setError("Ocorreu um erro ao processar o link retornado.");
        }
      } else {
        setError("Ocorreu um erro ao processar o link retornado.");
      }
    } else {
      setError(errorMap.createLink || "Ocorreu um erro. Tente novamente.");
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
      <Typography variant="h6">Link</Typography>

      <Stack component="form" spacing={3} width={400} onSubmit={handleSubmit}>
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

        <FormLabel component="legend">Escolha:</FormLabel>
        <FormControl component="fieldset">
          <RadioGroup
            name="platform-radio-buttons-group"
            value={selectedPlatforms}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPlatforms((prev) =>
                prev.includes(value)
                  ? prev.filter((platform) => platform !== value)
                  : [...prev, value]
              );
            }}
          >
            <Grid container spacing={2}>
              {platforms.map((platform) => (
                <Grid key={platform.name}>
                  <FormControlLabel
                    value={platform.name}
                    control={<Radio />}
                    label={
                      <Stack direction="row" alignItems="center">
                        {platform.icon}
                        <span style={{ marginLeft: 8 }}>{platform.name}</span>
                      </Stack>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>

        <Button variant="contained" fullWidth type="submit">
          Enviar
        </Button>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <List
        sx={{
          mt: 1,
          maxHeight: 300,
          overflowY: "auto",
          pr: 1,
        }}
      >
        {links.map((link) =>
          editingId === link.id ? (
            <ListItem disablePadding key={link.id}>
              <Stack direction="column" spacing={2} width="100%">
                <TextField
                  size="small"
                  label="Texto"
                  value={editValues.text || ""}
                  onChange={(e) =>
                    setEditValues({ ...editValues, text: e.target.value })
                  }
                  fullWidth
                  required
                />

                <TextField
                  size="small"
                  label="URL"
                  value={editValues.url || ""}
                  onChange={(e) =>
                    setEditValues({ ...editValues, url: e.target.value })
                  }
                  fullWidth
                />
              </Stack>
              <IconButton onClick={handleSave}>
                <Save color="warning" />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <Cancel color="error" />
              </IconButton>
            </ListItem>
          ) : (
            <ListItem disablePadding key={link.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                <ListItemText
                  primary={link.text}
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
            </ListItem>
          )
        )}
      </List>
    </Paper>
  );
}
