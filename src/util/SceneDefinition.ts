import { AuthCheck } from "../component/auth";
import { NavbarGroupDefinition } from "../component/Navbar";

export interface SceneDefinition {
  component: React.ComponentType<unknown>;
  route: string;
  authCheck?: AuthCheck;
  navbar?: {
    title: string;
    group?: NavbarGroupDefinition;
  };
}
