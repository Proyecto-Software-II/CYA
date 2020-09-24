import React, { useState } from "react";
//Styles
import "./styles.css";
//Libraries
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
//Context
import { useData } from "../../Context/DataContext";
//Icons
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
}));

const Login = () => {
  const classes = useStyles();
  const { url, setIsLoged, setToken, setUserData } = useData();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  if (isLoading) {
    return (
      <Box
        className={classes.root}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box
      className={classes.root}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {error && (
        <Alert severity="error">Usuario o contraseña incorrectos</Alert>
      )}
      <Paper>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={8}
        >
          <Typography variant="h2">CYA</Typography>
          <Box mt={3}>
            <TextField
              value={username}
              error={usernameError || error}
              label="Usuario"
              variant="outlined"
              helperText="@uptc.edu.co"
              onChange={(e) => {
                if (usernameError) {
                  setUsernameError(false);
                }
                if (error) {
                  setError(false);
                }
                setUsername(e.target.value);
              }}
            />
          </Box>
          <Box mt={3}>
            <TextField
              value={password}
              error={passwordError || error}
              label="Contraseña"
              variant="outlined"
              type="password"
              onChange={(e) => {
                if (passwordError) {
                  setPasswordError(false);
                }
                if (error) {
                  setError(false);
                }
                setPassword(e.target.value);
              }}
            />
          </Box>
          <Box mt={3}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<ArrowForwardIcon />}
              onClick={async () => {
                if (username === "") {
                  setUsernameError(true);
                } else if (password === "") {
                  setPasswordError(true);
                } else {
                  setIsLoading(true);
                  try {
                    const tokenResponse = await axios({
                      method: "POST",
                      url: `${url}/users/login`,
                      data: {
                        username,
                        password,
                      },
                    });
                    setIsLoged(true);
                    setToken(tokenResponse.data.token);
                    const userResponse = await axios({
                      method: "GET",
                      url: `${url}/users/info`,
                      headers: {
                        Authorization: `Bearer ${tokenResponse.data.token}`,
                      },
                    });
                    setUserData(userResponse.data.user);
                  } catch (e) {
                    //TODO: manejar error de coneccion
                    setError(true);
                    setIsLoading(false);
                  }
                }
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
