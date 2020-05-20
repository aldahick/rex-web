import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IAuthToken, IMutation, IMutationCreateAuthTokenLocalArgs } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";
import { StatusMessagesMethods } from "../../util/statusMessages";
import { Grids } from "../util/Grids";

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
  statusMessages: StatusMessagesMethods;
}

export const LocalAuthForm: React.FC<LocalAuthFormProps> = ({ onSuccess, statusMessages }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createAuthToken] = useMutation<{ authToken: IMutation["createAuthTokenLocal"] }, IMutationCreateAuthTokenLocalArgs>(MUTATION_CREATE_AUTH_TOKEN_LOCAL);

  const onSubmit = async () => {
    if (!username || !password) return;
    try {
      const { authToken } = await callMutationSafe(createAuthToken, { username, password });
      onSuccess(authToken);
    } catch (err) {
      statusMessages.setErrorMessage(err.message);
    }
  };

  const checkEnterKey = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key.toLowerCase() === "enter") {
      // should never catch
      onSubmit().catch(console.log);
    }
  };

  return (
    <Grids direction="column" alignItems="center">
      <TextField
        label="Username"
        value={username}
        onChange={evt => setUsername(evt.target.value)}
        onKeyDown={checkEnterKey}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={evt => setPassword(evt.target.value)}
        onKeyDown={checkEnterKey}
      />
      <Button onClick={onSubmit} color="primary" variant="outlined">Submit</Button>
    </Grids>
  );
};
