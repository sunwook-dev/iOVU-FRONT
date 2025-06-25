import React from "react";
import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import getColorTheme from "./color";

const MuiProvider = ({ children }) => {
  const theme = createTheme(getColorTheme());
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiProvider;
