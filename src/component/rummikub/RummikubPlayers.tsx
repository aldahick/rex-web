import { Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useState } from "react";

import { IRummikubPlayer, IRummikubServerPlayersPayload } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { SocketEvent } from "../socket/SocketEvent";

const useStyles = makeStyles({
  row: {
    border: "1px gray solid",
    borderRadius: "3px",
    marginBottom: "4px",
    padding: "2px",
    paddingLeft: "0.5em",
    paddingRight: "1em",
  },
  name: {
    fontWeight: "bold",
  },
});

export const RummikubPlayers: React.FC = () => {
  const { rummikubStore } = useStores();
  const [players, setPlayers] = useState<IRummikubPlayer[]>([]);
  const classes = useStyles();

  const onPlayersData = (data: IRummikubServerPlayersPayload) => {
    setPlayers(data.players);
    rummikubStore.setPlayerId(data.self._id);
  };

  return (
    <SocketEvent name="rummikub.server.players" handle={onPlayersData}>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h6">
            Players
          </Typography>
        </Grid>
        {players.map(player => (
          <Grid item key={player._id} className={classes.row}>
            <Typography className={classes.name} variant="body1">
              {player.name}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </SocketEvent>
  );
};
