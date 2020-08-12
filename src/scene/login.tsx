import React from "react";
import { Grid } from "@material-ui/core";
import { UserState } from "../component/auth";
import { GoogleLoginButton } from "../component/auth/GoogleLoginButton";
import { LocalAuthForm } from "../component/auth/LocalAuthForm";
import { config } from "../config";
import { IAuthToken } from "../graphql/types";

export const LoginScene: React.FC = () => {
  const onLogin = ({ token, user }: IAuthToken) => {
    UserState.setAuth(token, user.roles ?? []);
    window.location.href = config.baseUrl;
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item style={{ marginBottom: "1em" }}>
        <LocalAuthForm onSuccess={onLogin} />
      </Grid>
      <Grid container spacing={1}>
        <Grid item sm={6} />
        <Grid item sm={6}>
          {config.googleClientId !== undefined && (
            <GoogleLoginButton
              clientId={config.googleClientId}
              onSuccess={onLogin}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
