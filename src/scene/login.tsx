import { Grid } from "@material-ui/core";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { GoogleLoginButton } from "../component/auth/GoogleLoginButton";
import { LocalAuthForm } from "../component/auth/LocalAuthForm";
import { config } from "../config";
import { IAuthToken } from "../graphql";
import { useStores } from "../hook/useStores";

export const LoginScene: React.FC = observer(() => {
  const { authStore } = useStores();
  const [redirect, setRedirect] = useState(false);

  const onLogin = ({ token, user }: IAuthToken) => {
    authStore.setToken({
      token,
      roles: user.roles ?? []
    });
    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to={config.baseUrl} />;
  }

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
});
