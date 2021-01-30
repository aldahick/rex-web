import { Grid } from "@material-ui/core";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { container } from "tsyringe";

import { IAuthToken } from "../../graphql";
import { useStores } from "../../hooks";
import { ConfigService } from "../utils/config.service";
import { GoogleLoginButton } from "./components/GoogleLoginButton";
import { LocalAuthForm } from "./components/LocalAuthForm";

export const LoginPage: React.FC = observer(() => {
  const { authStore } = useStores();
  const [redirect, setRedirect] = useState(false);
  const { googleClientId = "" } = container.resolve(ConfigService);
  const onLogin = ({ token, user }: IAuthToken) => {
    authStore.setToken({
      token,
      roles: user.roles ?? []
    });
    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item style={{ marginBottom: "1em" }}>
        <LocalAuthForm onSuccess={onLogin} />
      </Grid>
      <Grid container spacing={1}>
        <Grid item sm={6} />
        <Grid item sm={6}>
          {googleClientId && (
            <GoogleLoginButton
              clientId={googleClientId}
              onSuccess={onLogin}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
});
