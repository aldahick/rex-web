import { Grid, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";

import { useStores } from "../hook/useStores";

export const DevScene: React.FC = observer(() => {
  const { authStore } = useStores();

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography>
          Token
        </Typography>
        <Typography>
          {authStore.token ?? "N/A"}
        </Typography>
      </Grid>
    </Grid>
  );
});
