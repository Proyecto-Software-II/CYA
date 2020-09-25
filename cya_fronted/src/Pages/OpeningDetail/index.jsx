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
  Grid,
  Paper,
  Button,
  Link,
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
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
}));

const Home = () => {
  const classes = useStyles();
  const { userData, setIsLoged, url, token } = useData();
  let history = useHistory();
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [opening, setOpening] = useState({});
  const [state, setState] = useState("C");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (userData.IS_ADMIN === 0) {
      history.push("/");
    } else {
      axios({
        method: "GET",
        url: `${url}/openings/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setOpening(res.data.opening[0]);
          setState(res.data.opening[0].STATE);
          setIsLoading(false);
        })
        .catch((e) => {
          history.push("/");
        });
    }
  }, [userData.IS_ADMIN, history, id, token, url]);

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
      <Box m={3} component={Paper}>
        <Box p={2}>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={3}>
              <Typography variant="h6">ID:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">{opening.ID}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Box p={2}>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={3}>
              <Typography variant="h6">Fecha:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">
                {moment(opening.TIMESTAMP).format("DD/MM/YY")}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box p={2}>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={3}>
              <Typography variant="h6">Carrera:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">{opening.CAREER}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Box p={2}>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={3}>
              <Typography variant="h6">Email:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">{opening.EMAIL}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Box p={2}>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={3}>
              <Typography variant="h6">Materia:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">{opening.NAME}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Box p={2}>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={3}>
              <Typography variant="h6">Archivo:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Link href={`${url}/static/openings/${opening.FILE_NAME}`}>
                <Button variant="contained" color="primary">
                  Ver archivo
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Box p={2}>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={3}>
              <Typography variant="h6">Estado:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state}
                onChange={(event) => {
                  if (event.target.value !== opening.STATE) {
                    setIsDisabled(false);
                  } else {
                    setIsDisabled(true);
                  }
                  setState(event.target.value);
                }}
              >
                <MenuItem value={"C"}>Creada</MenuItem>
                <MenuItem value={"A"}>Aceptada</MenuItem>
                <MenuItem value={"D"}>Denegada</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Box>
        <Box p={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            disabled={isDisabled}
            onClick={() => {
              axios({
                method: "PUT",
                url: `${url}/openings/${id}`,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                data: { state },
              }).then((res) => {
                history.push("/openings");
              });
            }}
          >
            Actualizar
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Home;
