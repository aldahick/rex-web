import React from "react";
import { Typography } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { Config } from "../../Config";
import { IAuthToken, IMutation, IMutationCreateAuthTokenGoogleArgs } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { callMutationSafe } from "../../util/graphql";

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
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
  const { statusStore } = useStores();
  const [createAuthToken] = useMutation<{ authToken: IMutation["createAuthTokenGoogle"] }, IMutationCreateAuthTokenGoogleArgs>(MUTATION_CREATE_AUTH_TOKEN_GOOGLE);

  const onGoogleAuth = async (
    res: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    if ("code" in res) { // we don't support this
      statusStore.setErrorMessage("You appear to be offline.");
      return;
    }
    try {
      const { authToken } = (await callMutationSafe(createAuthToken, {
        googleIdToken: res.tokenObj.id_token,
      }));
      onSuccess(authToken);
    } catch (err) {
      statusStore.setErrorMessage(err.message);
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
        statusStore.setErrorMessage(err.message);
      }}
    >
      <Typography style={{ fontWeight: 500 }}>Log In</Typography>
    </GoogleLogin>
  );
};
