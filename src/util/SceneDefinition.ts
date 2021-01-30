import { SidebarGroupDefinition } from "../component/layout/sidebar";
import { AuthCheck } from "../store";

export interface SceneDefinition {
  component: React.ComponentType<unknown>;
  route: string;
  authCheck?: AuthCheck;
  navbar?: {
    title: string;
    group?: SidebarGroupDefinition;
  };
}
