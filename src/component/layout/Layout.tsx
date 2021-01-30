import { ApolloProvider } from "@apollo/client";
import { Grid, makeStyles, Toolbar } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";

import { useStores } from "../../hook/useStores";
import { StatusMessages } from "../util/StatusMessages";
import { Navbar } from "./Navbar";
import { Sidebar } from "./sidebar";
import { ThemeProvider } from "./ThemeProvider";

const useStyles = makeStyles({
  content: {
    width: "100%"
  },
});

export const Layout: React.FC = observer(({ children }) => {
  const { apolloStore } = useStores();
  const classes = useStyles();

  return (
    <ApolloProvider client={apolloStore.client}>
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
    </ApolloProvider>
  );
});
