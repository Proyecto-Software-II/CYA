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
import { Link as RouterLink } from "react-router-dom";
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

  //TODO: modulo de creacion si no es admin

  console.log(userData);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${url}/cancellations`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      //TODO: filtrar si no es admin
      setCancellations(res.data.cancellations);
      setIsLoading(false);
    });
  }, [token, url]);

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
            <Typography variant="h6" className={classes.title}>
              CYA
            </Typography>
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
                  window.location.reload(true);
                }}
              >
                <ExitToAppIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </div>
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
                  <TableCell>{e.STATE}</TableCell>
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
                        <Button>Editar</Button>
                      </Link>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Home;
