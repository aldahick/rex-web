import React from "react";
import { Typography } from "@material-ui/core";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { AuthCheck, UserState } from "./UserState";

type SecureRouteProps = RouteProps & {
  check: AuthCheck;
  component: React.ComponentClass | React.FunctionComponent;
};

export const SecureRoute: React.FC<SecureRouteProps> = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  component: Component,
  check,
  ...rest
}) => {
  const render = (props: RouteComponentProps) => {
    const component = () => <Component {...props} />;

    if (!UserState.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return UserState.isAuthorized(check) ? component() : (
      <Typography color="error">
        Access denied.
      </Typography>
    );
  };

  return (
    <Route {...rest} render={render} />
  );
};
