import React, { useEffect, useState } from "react";
//Libraries
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Link,
  Paper,
  Button,
  CircularProgress,
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink, useHistory } from "react-router-dom";
import axios from "axios";
//Icons
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
//Context
import { useData } from "../../Context/DataContext";

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
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState("1");
  const [subjects, setSubjects] = useState({});
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userData.IS_ADMIN === 1) {
      history.push("/");
    } else {
      axios({
        method: "GET",
        url: `${url}/users/subjects`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        setSubjects(res.data.subjects);
        setIsLoading(false);
      });
    }
  }, [token, url, history, userData.IS_ADMIN]);

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
      <Box component={Paper} m={2}>
        <Alert severity="info">1. Descarga el formato de cancelación</Alert>
        <Box p={2} display="flex" justifyContent="center">
          <Link
            underline="none"
            href={`${url}/formats/FormatoCancelacion.docx`}
          >
            <Button variant="contained" color="primary">
              Descargar
            </Button>
          </Link>
        </Box>
        <Alert severity="info">
          2. Seleccione la materia que deseas cancelar (debe conincidir con la
          escrita en el documento)
        </Alert>
        <Box p={2} display="flex" justifyContent="center">
          {subjects.lengt === 0 ? (
            <Alert severity="error">No hay materias registradas</Alert>
          ) : (
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={state}
              onChange={(event) => {
                setState(event.target.value);
              }}
            >
              {subjects.map((e, i) => {
                return (
                  <MenuItem value={e.ID_SUBJECT} key={i}>
                    {e.NAME}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </Box>
        <Alert severity="info">
          3. Rellene el formato y subalo (Solo esta permitido el formato pdf)
        </Alert>
        {error && <Alert severity="error">{errorMessage}</Alert>}
        <Box p={2} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" component="label">
            Subir archivo
            <input
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => {
                if (error) {
                  setError(false);
                }
                setFile(e.target.files[0]);
              }}
            />
          </Button>
        </Box>
      </Box>
      <Box p={2} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (file === null) {
              setError(true);
              setErrorMessage("Debe subir un archivo");
            } else {
              if (file.name.split(".")[1] !== "pdf") {
                setError(true);
                setErrorMessage("El archivo debe estar en formato pdf");
              } else {
                let bodyFormData = new FormData();
                bodyFormData.append("subjectId", state);
                bodyFormData.append("pdf", file);
                axios({
                  method: "POST",
                  url: `${url}/cancellations`,
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                  data: bodyFormData,
                })
                  .then((res) => {
                    history.push("/cancellations");
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
            }
          }}
        >
          enviar
        </Button>
      </Box>
    </>
  );
};

export default Home;
