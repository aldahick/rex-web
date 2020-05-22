import * as React from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { Provider as MobxProvider } from "mobx-react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "typeface-open-sans";
import { SecureRoute, UserState } from "./component/auth";
import { Layout } from "./component/Layout";
import { Config } from "./Config";
import { useStores } from "./hook/useStores";
import { scenes } from "./scenes";
import { RootStore } from "./store/RootStore";

const ThemeProvider: React.FC = ({ children }) => {
  const { settingsStore } = useStores();

  const theme = createMuiTheme({
    typography: {
      fontFamily: "Open Sans",
      caption: {
        fontSize: "14px",
      },
    },
    palette: {
      type: settingsStore.settings.theme,
    },
  });

  document.body.style.background = theme.palette.background.default;

  // fix font colors
  const typographyKeys = Object.keys(theme.typography) as Array<keyof (typeof theme)["typography"]>;
  for (const typographyKey of typographyKeys) {
    const value = theme.typography[typographyKey];
    if (value && typeof (value) === "object") {
      value.color = theme.palette.text.primary;
    }
  }
  (theme.palette as any).info = theme.palette.primary;
  (theme.palette as any).success = theme.palette.primary;
  (theme.palette as any).warning = theme.palette.primary;

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
};

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

const rootStore = new RootStore();

export const App: React.FC = () => (
  <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
    <MobxProvider {...rootStore.allStores}>
      <ThemeProvider>
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
                  ? <SecureRoute {...props} check={scene.authCheck} />
                  : <Route {...props} />;
              })}
            </Switch>
          </Layout>
        </ApolloProvider>
      </ThemeProvider>
    </MobxProvider>
  </BrowserRouter>
);
