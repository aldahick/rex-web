import {
  Button, Grid, TextField, Typography,
} from "@material-ui/core";
import { observer } from "mobx-react";
import React, { useState } from "react";

import { IRummikubClientJoinPayload } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { SocketEvent } from "../socket/SocketEvent";

export const RummikubJoinForm: React.FC<{
  gameId: string;
  onJoin: () => void;
}> = observer(({ gameId, onJoin }) => {
  const { socketStore } = useStores();
  const storedName = sessionStorage.getItem("rummikub.name");
  const [name, setName] = useState(storedName ?? "");

  const join = () => {
    if (!name) {
      return;
    }
    sessionStorage.setItem("rummikub.name", name);
    const payload: IRummikubClientJoinPayload = {
      displayName: name,
      gameId,
    };
    socketStore.socket.emit("rummikub.client.join", payload);
  };

  if (!socketStore.isConnected) {
    return (
      <Typography>
        Connecting...
      </Typography>
    );
  }

  if (storedName !== null) {
    join();
  }

  return (
    <SocketEvent name="rummikub.client.join" handle={onJoin}>
      <Grid container alignItems="flex-end">
        <Grid item>
          <TextField
            label="Your Name"
            value={name}
            onChange={evt => setName(evt.target.value)}
            onKeyPress={evt => {
              if (evt.key === "Enter") {
                join();
              }
            }}
          />
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={join}>
            Join
          </Button>
        </Grid>
      </Grid>
    </SocketEvent>
  );
});
