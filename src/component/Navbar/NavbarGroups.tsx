import MemoryIcon from "@material-ui/icons/Memory";
import React from "react";

export interface NavbarGroupDefinition {
  title: string;
  icon?: JSX.Element;
}

export const NavbarGroups = {
  docker: {
    title: "Docker",
    icon: <MemoryIcon />,
  },
};
