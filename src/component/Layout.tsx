import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { Navbar } from "./Navbar";

const useStyles = makeStyles(theme => ({
  body: {
    paddingTop: "2em",
  },
  content: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: 250,
    },
    width: "100%",
  },
}));

export const Layout: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Grid container justify="center" className={classes.body}>
      <Navbar />
      <Grid item className={classes.content}>
        {children}
      </Grid>
    </Grid>
  );
};
