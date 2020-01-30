/* eslint-disable react/no-array-index-key */

import React from "react";
import { Grid } from "@material-ui/core";

type GridProps = Omit<Parameters<typeof Grid>[0], "container" | "item">;

type GridsProps = GridProps & {
  itemProps?: GridProps;
  children: React.ReactNode;
};

export const Grids: React.FC<GridsProps> = ({ itemProps = {}, children, ...rest }) => (
  <Grid container {...rest}>
    {((children instanceof Array) ? children : [children]).map((child, i) => (
      <Grid item key={i} {...itemProps}>
        {child}
      </Grid>
    ))}
  </Grid>
);
