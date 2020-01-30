import { AuthCheck } from "../component/auth";

export interface SceneDefinition {
  component: React.ComponentType<any>;
  route: string;
  authCheck?: AuthCheck;
  navbar?: {
    title: string;
  };
}
