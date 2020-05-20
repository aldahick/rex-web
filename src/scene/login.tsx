import React from "react";
import { Grid } from "@material-ui/core";
import { UserState } from "../component/auth";
import { GoogleLoginButton } from "../component/auth/GoogleLoginButton";
import { LocalAuthForm } from "../component/auth/LocalAuthForm";
import { Config } from "../Config";
import { IAuthToken } from "../graphql/types";
import { useStatusMessages } from "../util/statusMessages";

export const LoginScene: React.FC = () => {
  const statusMessages = useStatusMessages();

  const onLogin = ({ token, user }: IAuthToken) => {
    UserState.setAuth(token, user.roles || []);
    window.location.href = Config.baseUrl;
  };

  return (
    <Grid container direction="column" alignItems="center">
      {statusMessages.render()}
      <Grid item style={{ marginBottom: "1em" }}>
        <LocalAuthForm onSuccess={onLogin} statusMessages={statusMessages} />
      </Grid>
      <Grid container spacing={1}>
        <Grid item sm={6} />
        <Grid item sm={6}>
          <GoogleLoginButton onSuccess={onLogin} statusMessages={statusMessages} />
        </Grid>
      </Grid>
    </Grid>
  );
};
