import { Grid, makeStyles, Toolbar } from "@material-ui/core";
import React from "react";

import { StatusMessages } from "../util/StatusMessages";
import { Navbar } from "./Navbar";
import { Sidebar } from "./sidebar";
import { ThemeProvider } from "./ThemeProvider";

const useStyles = makeStyles({
  content: {
    width: "100%"
  },
});

export const Layout: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <ThemeProvider>
      <Navbar />
      <Sidebar />
      <StatusMessages />
      <Grid container justify="center">
        <Toolbar />
        <Grid item className={classes.content}>
          {children}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
