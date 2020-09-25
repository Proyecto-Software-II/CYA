import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
//Libraries
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
//Context
import { DataProvider } from "./Context/DataContext";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#e4a900",
      contrastText: "#fff",
    },
  },
});

ReactDOM.render(
  <DataProvider>
    <CssBaseline />
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </DataProvider>,
  document.getElementById("root")
);
