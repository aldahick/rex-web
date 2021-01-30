import "reflect-metadata";
import "typeface-open-sans";

import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { Provider as MobxProvider } from "mobx-react";
import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { container } from "tsyringe";

import { SecureRoute, UserState } from "./component/auth";
import { Layout } from "./component/layout/Layout";
import { config } from "./config";
import { scenes } from "./scenes";
import { RootStore } from "./store";

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

export const App: React.FC = () => {
  const rootStore = container.resolve(RootStore);

  return (
    <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
      <MobxProvider {...rootStore.allStores}>
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
      </MobxProvider>
    </BrowserRouter>
  );
};
