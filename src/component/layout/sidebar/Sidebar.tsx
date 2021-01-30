import {
  IconButton,
  List,
  makeStyles,
  SwipeableDrawer,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import * as _ from "lodash";
import { observer } from "mobx-react";
import React from "react";

import { useStores } from "../../../hook/useStores";
import { scenes } from "../../../scenes";
import { SceneDefinition } from "../../../util/SceneDefinition";
import { LogoutButton } from "../../auth/LogoutButton";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarItem, SidebarItemProps } from "./SidebarItem";

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
}));

const toNavbarItemProps = (scene: SceneDefinition): SidebarItemProps => ({
  title: scene.navbar?.title ?? "",
  url: scene.route,
  nested: !!scene.navbar?.group,
});

export const Sidebar: React.FC = observer(() => {
  const { authStore, sidebarStore } = useStores();
  const classes = useStyles();

  return (
    <nav className={classes.drawer}>
      <SwipeableDrawer
        variant="temporary"
        anchor="left"
        open={sidebarStore.isOpen}
        onClose={() => sidebarStore.setOpen(false)}
        onOpen={() => sidebarStore.setOpen(true)}
        // ModalProps={{ keepMounted: true }}
      >
        <div style={{ width: 250 }}>
          <List>
            {!authStore.isAuthenticated && (
              <SidebarItem title="Log In" url="/login" nested={false} />
            )}
            {Object.entries(_.groupBy(scenes.filter(
              ({ navbar, authCheck }) => !!navbar && (
                !authCheck
                || authStore.isAuthorized(authCheck)
              ),
            ), s => s.navbar?.group?.title)).map(([, children]) => (
              ({
                group: children[0].navbar?.group,
                items: children.map(toNavbarItemProps),
              })
            )).map(({ group, items }) => (group
              ? <SidebarGroup key={group.title} group={group} items={items} />
              : items.map(props => <SidebarItem key={props.url} {...props} />)))}
            {authStore.isAuthenticated && <LogoutButton />}
          </List>
        </div>
      </SwipeableDrawer>
      <IconButton
        size="medium"
        className={classes.openButton}
        onClick={() => sidebarStore.setOpen(true)}
      >
        <ChevronRightIcon className={classes.openButtonIcon} />
      </IconButton>
    </nav>
  );
});
