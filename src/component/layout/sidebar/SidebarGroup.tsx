import {
  Collapse, List, ListItem, ListItemIcon, ListItemText,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";

import { SidebarGroupDefinition } from "./sidebarGroups";
import { SidebarItem, SidebarItemProps } from "./SidebarItem";

interface SidebarGroupProps {
  items: Omit<SidebarItemProps, "nested">[];
  group: SidebarGroupDefinition;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({ items, group }) => {
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
          {items.map(props => <SidebarItem key={props.url} nested {...props} />)}
        </List>
      </Collapse>
    </>
  );
};
