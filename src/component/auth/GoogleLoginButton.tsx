import GoogleLogin, { GoogleLoginResponseOffline, GoogleLoginResponse } from "react-google-login";
import { useMutation } from "react-apollo";
import React from "react";
import gql from "graphql-tag";
import { Typography } from "@material-ui/core";
import { IMutation, IAuthToken, IMutationCreateAuthTokenGoogleArgs } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";
import { Config } from "../../Config";
import { StatusMessagesMethods } from "../../util/statusMessages";

const MUTATION_CREATE_AUTH_TOKEN_GOOGLE = gql`
mutation Web_CreateAuthTokenGoogle($googleIdToken: String!) {
  authToken: createAuthTokenGoogle(googleIdToken: $googleIdToken) {
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

interface GoogleLoginButtonProps {
  onSuccess: (authToken: IAuthToken) => void;
  statusMessages: StatusMessagesMethods;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, statusMessages }) => {
  const [createAuthToken] = useMutation<{ authToken: IMutation["createAuthTokenGoogle"] }, IMutationCreateAuthTokenGoogleArgs>(MUTATION_CREATE_AUTH_TOKEN_GOOGLE);

  const onGoogleAuth = async (
    res: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    if ("code" in res) { // we don't support this
      statusMessages.setErrorMessage("You appear to be offline.");
      return;
    }
    try {
      const { authToken } = (await callMutationSafe(createAuthToken, {
        googleIdToken: res.tokenObj.id_token,
      }));
      onSuccess(authToken);
    } catch (err) {
      statusMessages.setErrorMessage(err.message);
    }
  };

  return (
    <GoogleLogin
      clientId={Config.googleClientId}
      buttonText="Log In"
      onSuccess={onGoogleAuth}
      style={{ fontWeight: "bold" }}
      onFailure={err => {
        // eslint-disable-next-line no-console
        console.error(err);
        statusMessages.setErrorMessage(err.message);
      }}
    >
      <Typography style={{ fontWeight: 500 }}>Log In</Typography>
    </GoogleLogin>
  );
};
