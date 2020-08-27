import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { IAuthToken, IMutation, IMutationCreateAuthTokenGoogleArgs } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { callMutationSafe } from "../../util/graphql";

const useStyles = makeStyles(theme => ({
  loginButton: {
    fontWeight: "bold"
  },
  loginLabel: {
    fontWeight: 500,
    color: theme.palette.grey[600]
  }
}));

const MUTATION_CREATE_AUTH_TOKEN_GOOGLE = gql`
mutation Web_CreateAuthTokenGoogle($googleIdToken: String!) {
  authToken: createAuthTokenGoogle(googleIdToken: $googleIdToken, clientType: WEB) {
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

export const GoogleLoginButton: React.FC<{
  clientId: string;
  onSuccess: (authToken: IAuthToken) => void;
}> = ({ clientId, onSuccess }) => {
  const { statusStore } = useStores();
  const [createAuthToken] = useMutation<{
    authToken: IMutation["createAuthTokenGoogle"];
  }, Omit<IMutationCreateAuthTokenGoogleArgs, "clientType">>(MUTATION_CREATE_AUTH_TOKEN_GOOGLE);
  const classes = useStyles();

  const onGoogleAuth = async (
    res: GoogleLoginResponse | GoogleLoginResponseOffline,
  ): Promise<void> => {
    if ("code" in res) { // we don't support this
      statusStore.setErrorMessage("You appear to be offline.");
      return;
    }
    try {
      const { authToken } = await callMutationSafe(createAuthToken, {
        googleIdToken: res.tokenObj.id_token,
      });
      onSuccess(authToken);
    } catch (err) {
      statusStore.setErrorMessage(err instanceof Error ? err.message : err);
    }
  };

  return (
    <GoogleLogin
      clientId={clientId}
      onSuccess={onGoogleAuth}
      className={classes.loginButton}
      onFailure={(err): void => {
        // eslint-disable-next-line no-console
        console.error(err);
        statusStore.setErrorMessage(err instanceof Error ? err.message : err);
      }}
    >
      <Typography className={classes.loginLabel}>
        Log In
      </Typography>
    </GoogleLogin>
  );
};
