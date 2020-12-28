import { MobXProviderContext } from "mobx-react";
import { useContext } from "react";

import { RootStore } from "../store/RootStore";

export const useStores = (): RootStore["allStores"] => useContext(
  MobXProviderContext as unknown as React.Context<RootStore["allStores"]>
);
