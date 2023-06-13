import "reflect-metadata";
import "typeface-open-sans";

import * as _ from "lodash";
import { Provider as MobxProvider } from "mobx-react";
import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { container } from "tsyringe";

import * as features from "./features";
import { SecureRoute } from "./features/auth";
import { Layout } from "./features/layout";
import { ConfigService } from "./features/utils/config.service";
import { RootStore } from "./store";

export const App: React.FC = () => {
  const config = container.resolve(ConfigService);
  const rootStore = container.resolve(RootStore);
  const pages = _.flatten(Object.values(features).map(f => f.pages ?? []));

  return (
    <BrowserRouter basename={config.baseUrl}>
      <MobxProvider {...rootStore.allStores}>
        <Layout>
          <Switch>
            {pages.map(page => {
              const props = {
                key: page.route,
                exact: true,
                path: page.route,
                component: page.component,
              };
              return page.permissions
                ? <SecureRoute {...props} permissions={page.permissions} />
                : <Route {...props} />;
            })}
          </Switch>
        </Layout>
      </MobxProvider>
    </BrowserRouter>
  );
};
