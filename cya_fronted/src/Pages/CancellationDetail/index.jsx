import React from "react";
//Libraries
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
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
}));

const CancellationDetail = () => {
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
    </>
  );
};

export default CancellationDetail;
