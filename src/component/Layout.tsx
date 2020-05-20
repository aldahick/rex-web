import React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { Navbar } from "./Navbar";

const useStyles = makeStyles({
  content: {
    width: "100%",
    marginTop: "4em",
  },
});

export const Layout: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Grid container justify="center">
      <Navbar />
      <Grid item className={classes.content}>
        {children}
      </Grid>
    </Grid>
  );
};
