import {
  Button, Grid, makeStyles, TextField,
} from "@material-ui/core";
import * as _ from "lodash";
import React, { useState } from "react";

import { IRummikubClientChatPayload, IRummikubServerChatPayload } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { SocketEvent } from "../socket/SocketEvent";

const useStyles = makeStyles({
  chatContainer: {
    height: 400,
    overflowY: "scroll",
  },
  inputContainer: {
    flexGrow: 1,
  },
});

export const RummikubChat: React.FC = () => {
  const { socketStore } = useStores();
  const [messages, setMessages] = useState<IRummikubServerChatPayload[]>([]);
  const [messageText, setMessageText] = useState("");
  const classes = useStyles();

  const onChat = (data: IRummikubServerChatPayload) => {
    setMessages(messages.concat([data]));
  };

  const sendMessage = () => {
    if (!messageText) {
      return;
    }
    const payload: IRummikubClientChatPayload = {
      message: messageText,
    };
    socketStore.socket.emit("rummikub.client.chat", payload);
    setMessageText("");
  };

  return (
    <SocketEvent name="rummikub.server.chat" handle={onChat}>
      <Grid container direction="column">
        <Grid item>
          <Grid container direction="column" className={classes.chatContainer}>
            {_.sortBy(
              messages,
              m => new Date(m.createdAt).getTime(),
            ).map(({
              id, createdAt, message, author,
            }) => (
              <Grid item key={id}>
                {new Date(createdAt).toLocaleTimeString()}
                {" "}
                {author?.name ?? "System"}
                :
                {" "}
                {message}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <Grid container alignItems="flex-end">
            <Grid item className={classes.inputContainer}>
              <TextField
                label="Message"
                value={messageText}
                fullWidth
                onChange={evt => setMessageText(evt.target.value)}
                onKeyPress={evt => {
                  if (evt.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={sendMessage}>
                Send
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </SocketEvent>
  );
};
