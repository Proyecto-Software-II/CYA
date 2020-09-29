import React, { useEffect, useState } from "react";
//Libraries
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  TextField,
  Paper,
  Button,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink, useHistory } from "react-router-dom";
import axios from "axios";
//Icons
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
//Context
import { useData } from "../../Context/DataContext";
//Images
import Banner from "../../assets/images/banner.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: "white",
  },
  table: {
    minWidth: 650,
  },
}));

const Home = () => {
  const classes = useStyles();
  const { userData, setIsLoged, token, url } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [openningMessage, setOpenningMessage] = useState("");
  const [newOpenningMessage, setNewOpenningMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  let history = useHistory();

  useEffect(() => {
    if (userData.IS_ADMIN === 0) {
      history.push("/");
    } else {
      axios({
        method: "GET",
        url: `${url}/openings/message`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setOpenningMessage(res.data.message);
          setIsLoading(false);
        })
        .catch((e) => {
          setOpenningMessage(
            "No se ha registrado fecha para el limite de recepcion de solicitudes"
          );
          setIsLoading(false);
        });
    }
  }, [token, url, userData.IS_ADMIN, history]);

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
    <>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Link
              component={RouterLink}
              underline="none"
              to={`/`}
              className={classes.title}
            >
              <Typography variant="h6">CYA</Typography>
            </Link>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6" className={classes.title}>
                {userData.USERNAME}
              </Typography>
              <IconButton
                color="inherit"
                onClick={() => {
                  setIsLoged(false);
                  history.push("/");
                  window.location.reload(true);
                }}
              >
                <ExitToAppIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </div>
      <Box display="flex" justifyContent="center">
        <img src={Banner} alt="banner-uptc" />
      </Box>
      <Box m={2} component={Paper}>
        <Alert severity="info">{openningMessage}</Alert>
        <Box p={2} display="flex" justifyContent="center">
          <TextField
            label="Nuevo mensaje"
            variant="outlined"
            value={newOpenningMessage}
            onChange={(e) => {
              if (e.target.value !== "") {
                setIsDisabled(false);
              } else {
                setIsDisabled(true);
              }
              setNewOpenningMessage(e.target.value);
            }}
          />
        </Box>
        <Alert severity="info">{newOpenningMessage}</Alert>
        <Box p={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            disabled={isDisabled}
            onClick={() => {
              axios({
                method: "PUT",
                url: `${url}/openings/message`,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                data: {
                  message: newOpenningMessage,
                },
              }).then((res) => {
                history.push("/openings");
              });
            }}
          >
            Cambiar mensaje
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Home;
