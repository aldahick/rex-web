import {
  List,
  makeStyles,
  SwipeableDrawer,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import * as _ from "lodash";
import React, { useState } from "react";
import { UserState } from "../auth";
import { scenes } from "../../scenes";
import { LoginButton } from "../auth/LoginButton";
import { LogoutButton } from "../auth/LogoutButton";
import { SceneDefinition } from "../../util/SceneDefinition";
import { NavbarItemProps, NavbarItem } from "./NavbarItem";
import { NavbarGroup } from "./NavbarGroup";

const DRAWER_WIDTH = 250;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
  },
  fixedDrawer: {
    width: DRAWER_WIDTH,
  },
  openButton: {
    position: "fixed",
    left: "0",
    top: "0",
  },
  openButtonIcon: {
    backgroundColor: "lightgray",
    border: "1px solid lightgray",
    borderRadius: "50%",
  },
  titleText: {
    fontWeight: 600,
    marginLeft: "1em",
  },
}));

const toNavbarItemProps = (scene: SceneDefinition): NavbarItemProps => ({
  title: scene.navbar?.title || "",
  url: scene.route,
  nested: !!scene.navbar?.group,
});

const renderDrawer = () => (
  <div style={{ width: 250 }}>
    <List>
      {!UserState.isAuthenticated && <LoginButton />}
      {UserState.isAuthenticated && (
        Object.entries(_.groupBy(scenes.filter(
          ({ navbar, authCheck }) => !!navbar && (
            !authCheck
            || UserState.isAuthorized(authCheck)
          ),
        ), s => s.navbar?.group?.title)).map(([, children]) => (
          ({
            group: children[0].navbar?.group,
            items: children.map(toNavbarItemProps),
          })
        )).map(({ group, items }) => (group
          ? <NavbarGroup key={group.title} group={group} items={items} />
          : items.map(props => <NavbarItem key={props.title.toString()} {...props} />)))
      )}
      {UserState.isAuthenticated && <LogoutButton />}
    </List>
  </div>
);

export const Navbar: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.titleText}>
            Rex
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* <Hidden smUp> */}
        <SwipeableDrawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          ModalProps={{ keepMounted: true }}
        >
          {renderDrawer()}
        </SwipeableDrawer>
        <IconButton
          size="medium"
          className={classes.openButton}
          onClick={() => setOpen(true)}
        >
          <ChevronRightIcon className={classes.openButtonIcon} />
        </IconButton>
      </nav>
    </>
  );
};
