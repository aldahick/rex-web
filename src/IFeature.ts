import { AuthCheck } from "./store";

export interface IPageDefinition {
  component: React.ComponentType<unknown>;
  route: string;
  authCheck?: AuthCheck;
  navbar?: {
    title: string;
  };
}

export interface IFeature {
  pages?: IPageDefinition[];
}
