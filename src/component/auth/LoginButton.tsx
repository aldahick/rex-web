import GoogleLogin, { GoogleLoginResponseOffline, GoogleLoginResponse } from "react-google-login";
import { useMutation } from "react-apollo";
import React, { useState } from "react";
import gql from "graphql-tag";
import { IMutation, IMutationCreateAuthTokenArgs, IAuthToken } from "../../graphql/types";
import { UserState } from "./UserState";
import { callMutationSafe } from "../../util/graphql";
import { Config } from "../../Config";
import { PopupMessage } from "../PopupMessage";

const MUTATION_CREATE_AUTH_TOKEN = gql`
mutation Web_CreateAuthToken($googleIdToken: String!) {
  authToken: createAuthToken(googleIdToken: $googleIdToken) {
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

export const LoginButton: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState();
  const [createAuthToken] = useMutation<{ authToken: IMutation["createAuthToken"] }, IMutationCreateAuthTokenArgs>(MUTATION_CREATE_AUTH_TOKEN);

  const onGoogleAuth = async (
    res: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    if ("code" in res) { // we don't support this
      setErrorMessage("You appear to be offline.");
      return;
    }
    let authToken: IAuthToken;
    try {
      authToken = (await callMutationSafe(createAuthToken, {
        googleIdToken: res.tokenObj.id_token,
      })).authToken;
    } catch (err) {
      setErrorMessage(err.message);
      return;
    }
    UserState.setAuth(authToken.token, authToken.user.roles || []);
    window.location.reload();
  };

  return (
    <>
      <PopupMessage text={errorMessage} severity="error" />
      <GoogleLogin
        clientId={Config.googleClientId}
        buttonText="Log In"
        onSuccess={onGoogleAuth}
        onFailure={err => {
          // eslint-disable-next-line no-console
          console.error(err);
          setErrorMessage(err.message);
        }}
      />
    </>
  );
};
