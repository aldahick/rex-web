import React, { useState } from "react";
import {
  Collapse, List, ListItem, ListItemIcon, ListItemText,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { NavbarGroupDefinition } from "./NavbarGroups";
import { NavbarItemProps, NavbarItem } from "./NavbarItem";

interface NavbarGroupProps {
  items: Omit<NavbarItemProps, "nested">[];
  group: NavbarGroupDefinition;
}

export const NavbarGroup: React.FC<NavbarGroupProps> = ({ items, group }) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)}>
        {group.icon && (
          <ListItemIcon>
            {group.icon}
          </ListItemIcon>
        )}
        <ListItemText primary={group.title} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map(props => <NavbarItem key={props.url} nested {...props} />)}
        </List>
      </Collapse>
    </>
  );
};
