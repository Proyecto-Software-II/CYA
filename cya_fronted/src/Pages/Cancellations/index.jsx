import React, { useEffect, useState } from "react";
//Styles
import "./styles.css";
//Libraries
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  const [cancellations, setCancellations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let history = useHistory();

  useEffect(() => {
    axios({
      method: "GET",
      url: `${url}/cancellations`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (userData.IS_ADMIN === 1) {
        setCancellations(res.data.cancellations);
      } else {
        const data = res.data.cancellations.filter(
          (e) => e.EMAIL === userData.EMAIL
        );
        setCancellations(data);
      }

      setIsLoading(false);
    });
  }, [token, url, userData.IS_ADMIN, userData.EMAIL]);

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
      {cancellations.length === 0 ? (
        <Alert severity="info">No hay cancelaciones para mostrar</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Materia</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Archivo</TableCell>
                  {userData.IS_ADMIN === 1 && <TableCell>Opciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {cancellations.map((e, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {e.ID}
                      </TableCell>
                      <TableCell>{e.USERNAME}</TableCell>
                      <TableCell>{e.EMAIL}</TableCell>
                      <TableCell>{e.NAME}</TableCell>
                      {e.STATE === "A" && <TableCell>Aceptada</TableCell>}
                      {e.STATE === "C" && <TableCell>Creada</TableCell>}
                      {e.STATE === "D" && <TableCell>Denegada</TableCell>}
                      <TableCell>
                        <Link href={`${url}/static/${e.FILE_NAME}`}>
                          {e.FILE_NAME}
                        </Link>
                      </TableCell>
                      {userData.IS_ADMIN === 1 && (
                        <TableCell>
                          <Link
                            component={RouterLink}
                            underline="none"
                            to={`/cancellations/${e.ID}`}
                          >
                            <Button variant="contained" color="primary">
                              Editar
                            </Button>
                          </Link>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {userData.IS_ADMIN === 0 && (
            <Box mt={2} display="flex" justifyContent="center">
              <Button variant="contained" color="primary">
                Agregar cancelacion
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default Home;