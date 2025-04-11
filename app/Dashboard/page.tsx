"use client";

import React from "react";
import Menu from "@/components/navbar";
import Footer from "@/components/footer";
import MyLinks from "@/app/componentesDashboard/credenciais/page";
import Subcredenciais from "@/app/componentesDashboard/subCredenciais/page";
import TemplateSelector from "@/app/componentesDashboard/escolherTela/page";
import { Tab, Box, Container } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export default function Dashboard() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Menu />

      <TabContext value={value}>
        <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TabPanel value="1" sx={{ width: "100%" }}>
              <Subcredenciais />
            </TabPanel>
            <TabPanel value="2" sx={{ width: "100%" }}>
              <MyLinks />
            </TabPanel>
            <TabPanel value="3" sx={{ width: "100%" }}>
              <TemplateSelector />
            </TabPanel>
          </Box>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <TabList onChange={handleChange} aria-label="Dashboard Tabs">
              <Tab label="Títulos" value="1" />
              <Tab label="Links" value="2" />
              <Tab label="Escolha de tela" value="3" />
            </TabList>
          </Box>
        </Container>
      </TabContext>

      <Footer />
    </Box>
  );
}
