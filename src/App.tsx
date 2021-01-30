import "reflect-metadata";
import "typeface-open-sans";

import { Provider as MobxProvider } from "mobx-react";
import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { container } from "tsyringe";

import { SecureRoute } from "./component/auth";
import { Layout } from "./component/layout/Layout";
import { scenes } from "./scenes";
import { RootStore } from "./store";

export const App: React.FC = () => {
  const rootStore = container.resolve(RootStore);

  return (
    <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
      <MobxProvider {...rootStore.allStores}>
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
      </MobxProvider>
    </BrowserRouter>
  );
};
