/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Typography } from "@material-ui/core";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { AuthCheck, UserState } from "./UserState";

type SecureRouteProps = RouteProps & {
  check: AuthCheck;
  component: React.ComponentClass | React.FunctionComponent;
};

export const SecureRoute: React.FC<SecureRouteProps> = ({
  component: Component,
  check,
  ...rest
}) => {
  const render = (props: any) => {
    const component = () => <Component {...props} />;

    if (!UserState.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    const isAuthorized = !check || UserState.isAuthorized(check);
    if (!isAuthorized) {
      return <Typography color="error">Access denied.</Typography>;
    }
    return isAuthorized && component();
  };

  return (
    <Route {...rest} render={render} />
  );
};
