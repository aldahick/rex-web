import React from "react";
import { Typography } from "@material-ui/core";
import { Grids } from "../component/util/Grids";
import { UserState } from "../component/auth";

export const DevScene = () => (
  <Grids direction="column">
    <>
      <Typography>Token</Typography>
      <Typography>{UserState.token || "N/A"}</Typography>
    </>
  </Grids>
);
