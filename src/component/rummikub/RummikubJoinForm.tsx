import React, { useState } from "react";
import {
  Button, TextField, Typography,
} from "@material-ui/core";
import { observer } from "mobx-react";
import { IRummikubClientJoinPayload } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { SocketEvent } from "../socket/SocketEvent";
import { Grids } from "../util/Grids";

export const RummikubJoinForm: React.FC<{
  gameId: string;
  onJoin: () => void;
}> = observer(({ gameId, onJoin }) => {
  const { socketStore } = useStores();
  const [name, setName] = useState(sessionStorage.getItem("rummikub.name") || "");

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

  if (!socketStore.socket) {
    return <Typography>Connecting...</Typography>;
  }

  if (sessionStorage.getItem("rummikub.name")) {
    join();
  }

  return (
    <SocketEvent name="rummikub.client.join" handle={onJoin}>
      <Grids alignItems="flex-end">
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
        <Button variant="outlined" onClick={join}>Join</Button>
      </Grids>
    </SocketEvent>
  );
});
