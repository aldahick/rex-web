import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { UserState } from "../component/auth";

export const DevScene: React.FC = () => (
  <Grid container direction="column">
    <Grid item>
      <Typography>
        Token
      </Typography>
      <Typography>
        {UserState.token ?? "N/A"}
      </Typography>
    </Grid>
  </Grid>
);
