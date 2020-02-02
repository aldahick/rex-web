import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { Navbar } from "./Navbar";

const useStyles = makeStyles({
  content: {
    width: "100%",
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
