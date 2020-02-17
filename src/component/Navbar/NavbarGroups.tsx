import React from "react";
import MemoryIcon from "@material-ui/icons/Memory";

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
