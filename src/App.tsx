import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "typeface-open-sans";
import { SecureRoute, UserState } from "./component/auth";
import { Layout } from "./component/Layout";
import { Config } from "./Config";
import { scenes } from "./scenes";

const theme = createMuiTheme({
  typography: {
    // fontFamily: "Open Sans",
    caption: {
      fontSize: "14px",
    },
  },
});

(theme.palette as any).info = theme.palette.primary;
(theme.palette as any).success = theme.palette.primary;
(theme.palette as any).warning = theme.palette.primary;

const client = new ApolloClient({
  link: setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: UserState.token ? `Bearer ${UserState.token}` : "",
    },
  })).concat(createHttpLink({
    uri: `${Config.apiUrl}/graphql`,
  })),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: { errorPolicy: "all" },
    mutate: { errorPolicy: "all" },
  },
});

export const App: React.FC = () => (
  <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
    <MuiThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <Layout>
          <Switch>
            {scenes.map(scene => {
              const props = {
                key: scene.route,
                exact: true,
                path: scene.route,
                component: scene.component,
              };
              return scene.authCheck
                // eslint-disable-next-line react/jsx-props-no-spreading
                ? <SecureRoute {...props} check={scene.authCheck} />
                // eslint-disable-next-line react/jsx-props-no-spreading
                : <Route {...props} />;
            })}
          </Switch>
        </Layout>
      </ApolloProvider>
    </MuiThemeProvider>
  </BrowserRouter>
);
