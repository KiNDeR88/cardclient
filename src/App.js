import React from "react";
import CustomerProfileCard from "./CustomerProfileCard";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomerProfileCard />
    </ThemeProvider>
  );
}

export default App;