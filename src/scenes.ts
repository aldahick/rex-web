import { SceneDefinition } from "./util/SceneDefinition";
import { DevScene } from "./scene/dev";
import { DockerHostsScene } from "./scene/docker/hosts";
import { DockerContainersScene } from "./scene/docker/containers";

export const scenes: SceneDefinition[] = [
  {
    route: "/dev",
    component: DevScene,
  },
  {
    route: "/docker/containers",
    component: DockerContainersScene,
    authCheck: can => can.read("container"),
    navbar: {
      title: "Docker Containers",
    },
  },
  {
    route: "/docker/hosts",
    component: DockerHostsScene,
    authCheck: can => can.read("host"),
    navbar: {
      title: "Docker Hosts",
    },
  },
];
