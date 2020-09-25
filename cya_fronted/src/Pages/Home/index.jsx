import React from "react";
//Styles
import "./styles.css";
//Libraries
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Grid,
  Paper,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
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
  },
}));

const Home = () => {
  const classes = useStyles();
  const { userData, setIsLoged } = useData();
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
      <Box display="flex" justifyContent="center">
        <img src={Banner} alt="banner-uptc" />
      </Box>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
      >
        <Grid item>
          <Paper>
            <Box p={5} mt={3} mx={2}>
              <Link
                component={RouterLink}
                underline="none"
                to={`/cancellations`}
              >
                <Typography variant="h2">Cancelacion</Typography>
              </Link>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box p={5} mt={3} mx={2}>
              <Link component={RouterLink} underline="none" to={`/openings`}>
                <Typography variant="h2">Apertura</Typography>
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
