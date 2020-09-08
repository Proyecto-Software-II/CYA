import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
//Libraries
import CssBaseline from "@material-ui/core/CssBaseline";
//Context
import { DataProvider } from "./Context/DataContext";

ReactDOM.render(
  <DataProvider>
    <CssBaseline />
    <App />
  </DataProvider>,
  document.getElementById("root")
);
