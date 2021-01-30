import { AuthCheck } from "../component/auth";
import { SidebarGroupDefinition } from "../component/layout/sidebar";

export interface SceneDefinition {
  component: React.ComponentType<unknown>;
  route: string;
  authCheck?: AuthCheck;
  navbar?: {
    title: string;
    group?: SidebarGroupDefinition;
  };
}
