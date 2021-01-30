import { useMutation } from "@apollo/client";
import { Button, Grid, TextField } from "@material-ui/core";
import gql from "graphql-tag";
import React, { useState } from "react";

import { IAuthToken, IMutation, IMutationCreateAuthTokenLocalArgs } from "../../graphql";
import { useStores } from "../../hook/useStores";
import { callMutationSafe } from "../../util/graphql";

const MUTATION_CREATE_AUTH_TOKEN_LOCAL = gql`
mutation Web_CreateAuthTokenLocal($username: String!, $password: String!) {
  authToken: createAuthTokenLocal(username: $username, password: $password) {
    token
    user {
      roles {
        name
        permissions {
          action
          resource
        }
      }
    }
  }
}
`;

interface LocalAuthFormProps {
  onSuccess: (authToken: IAuthToken) => void;
}

export const LocalAuthForm: React.FC<LocalAuthFormProps> = ({ onSuccess }) => {
  const { statusStore } = useStores();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createAuthToken] = useMutation<{ authToken: IMutation["createAuthTokenLocal"] }, IMutationCreateAuthTokenLocalArgs>(MUTATION_CREATE_AUTH_TOKEN_LOCAL);

  const onSubmit = async () => {
    if (!username || !password) {
      return;
    }
    try {
      const { authToken } = await callMutationSafe(createAuthToken, { username, password });
      onSuccess(authToken);
    } catch (err) {
      statusStore.setErrorMessage(err instanceof Error ? err.message : err);
    }
  };

  const checkEnterKey = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key.toLowerCase() === "enter") {
      // should never catch
      onSubmit().catch(console.log);
    }
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <TextField
          label="Username"
          value={username}
          onChange={evt => setUsername(evt.target.value)}
          onKeyDown={checkEnterKey}
          autoFocus
        />
      </Grid>
      <Grid item>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={evt => setPassword(evt.target.value)}
          onKeyDown={checkEnterKey}
        />
      </Grid>
      <Grid item>
        <Button onClick={onSubmit} color="primary" variant="outlined">
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};
