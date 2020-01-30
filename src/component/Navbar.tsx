import {
  AppBar, MenuItem, Toolbar, makeStyles, Link,
} from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { UserState } from "./auth";
import { scenes } from "../scenes";
import { LogoutButton } from "./auth/LogoutButton";
import { LoginButton } from "./auth/LoginButton";

const useStyles = makeStyles({
  link: {
    color: "white",
    textDecoration: "none",
  },
});

export const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        {scenes.filter(
          ({ navbar, authCheck }) => (
            !!navbar?.title && (
              !authCheck || UserState.isAuthorized(authCheck)
            )
          ),
        ).map(({ navbar, route }) => (
          <MenuItem key={navbar?.title}>
            <Link component={RouterLink} to={route} className={classes.link}>
              {navbar?.title}
            </Link>
          </MenuItem>
        ))}
        <div style={{ flexGrow: 1 }} />
        {UserState.isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </Toolbar>
    </AppBar>
  );
};
