import * as React from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { observer, Provider as MobxProvider } from "mobx-react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "typeface-open-sans";
import { SecureRoute, UserState } from "./component/auth";
import { Layout } from "./component/Layout";
import { config } from "./config";
import { useStores } from "./hook/useStores";
import { scenes } from "./scenes";
import { RootStore } from "./store/RootStore";
import { fixMaterialTheme } from "./util/fixMaterialTheme";

const ThemeProvider: React.FC = observer(({ children }) => {
  const { settingsStore } = useStores();

  const theme = fixMaterialTheme(createMuiTheme({
    typography: {
      fontFamily: "Open Sans",
      caption: {
        fontSize: "14px",
      },
    },
    palette: {
      type: settingsStore.get("theme"),
    },
  }));

  document.body.style.background = theme.palette.background.default;

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
});

const client = new ApolloClient({
  link: setContext((_, { headers }: { headers: Record<string, string> }) => ({
    headers: {
      ...headers,
      authorization: UserState.token !== undefined ? `Bearer ${UserState.token}` : "",
    },
  })).concat(createHttpLink({
    uri: `${config.apiUrl}/graphql`,
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
