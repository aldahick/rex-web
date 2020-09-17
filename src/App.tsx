import * as React from "react";
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { observer, Provider as MobxProvider } from "mobx-react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "mobx-react/batchingForReactDom";
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
  link: createHttpLink({
    uri: `${config.apiUrl}/graphql`,
    headers: {
      authorization: UserState.token !== undefined ? `Bearer ${UserState.token}` : ""
    }
  }),
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
