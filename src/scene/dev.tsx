import React from "react";
import { Typography } from "@material-ui/core";
import { UserState } from "../component/auth";
import { Grids } from "../component/util/Grids";

export const DevScene = () => (
  <Grids direction="column">
    <>
      <Typography>Token</Typography>
      <Typography>{UserState.token || "N/A"}</Typography>
    </>
  </Grids>
);
