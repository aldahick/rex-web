import { Grid, makeStyles } from "@material-ui/core";
import React from "react";

import { Navbar } from "./Navbar";
import { StatusMessages } from "./util/StatusMessages";

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
      <StatusMessages />
      <Grid item className={classes.content}>
        {children}
      </Grid>
    </Grid>
  );
};
