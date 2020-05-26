import React from "react";
import {
  ListItem, ListItemIcon, ListItemText, makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useStores } from "../../hook/useStores";

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export interface NavbarItemProps {
  title: string | JSX.Element;
  url: string;
  icon?: JSX.Element;
  nested: boolean;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({
  title, url, icon, nested,
}) => {
  const { navbarStore } = useStores();
  const classes = useStyles();

  return (
    <ListItem
      button
      component={Link}
      to={url}
      className={nested ? classes.nested : undefined}
      onClick={() => navbarStore.setOpen(false)}
    >
      {icon && (
        <ListItemIcon>
          {icon}
        </ListItemIcon>
      )}
      {typeof title === "string"
        ? <ListItemText primary={title} />
        : title}
    </ListItem>
  );
};
