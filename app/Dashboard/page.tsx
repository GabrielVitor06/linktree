"use client";

import MyLinks from "@/app/componentesDashboard/credenciais/page";
import Subcredenciais from "@/app/componentesDashboard/subCredenciais/page";
import Menu from "@/components/navbar";
import { MdAddToHomeScreen } from "react-icons/md";
import { Stack, Button } from "@mui/material";

export default function Dashboard() {
  return (
    <>
      <Menu />
      <Stack p={4}>
        <Stack
          justifyContent="center"
          alignItems="center"
          height={"90vh"}
          spacing={3}
        >
          <Button
            variant="outlined"
            startIcon={<MdAddToHomeScreen />}
            href="/componentesDashboard/escolherTela"
            disableElevation
          >
            Escolha sua tela
          </Button>
          <Stack spacing={4}>
            <Subcredenciais />
            <MyLinks />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
