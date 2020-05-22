import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";
import { RootStore } from "../store/RootStore";

export const useStores = () => useContext<RootStore["allStores"]>(MobXProviderContext as any);
