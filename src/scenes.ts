import { SceneDefinition } from "./util/SceneDefinition";
import { DevScene } from "./scene/dev";

export const scenes: SceneDefinition[] = [
  {
    route: "/dev",
    component: DevScene,
    authCheck: can => can.read("user"),
    navbar: { title: "Dev Utils" },
  },
];
