import { Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";

import { useStores } from "../../../hooks";
import { AuthCheck } from "../../../store";

type SecureRouteProps = RouteProps & {
  check: AuthCheck;
  component: React.ComponentClass | React.FunctionComponent;
};

export const SecureRoute: React.FC<SecureRouteProps> = observer(({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  component: Component,
  check,
  ...rest
}) => {
  const { authStore } = useStores();

  const render = (props: RouteComponentProps) => {
    const component = () => <Component {...props} />;

    if (!authStore.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return authStore.isAuthorized(check) ? component() : (
      <Typography color="error">
        Access denied.
      </Typography>
    );
  };

  return (
    <Route {...rest} render={render} />
  );
});
