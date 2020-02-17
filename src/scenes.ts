import { SceneDefinition } from "./util/SceneDefinition";
import { DevScene } from "./scene/dev";
import { DockerHostsScene } from "./scene/docker/hosts";
import { DockerContainersScene } from "./scene/docker/containers";
import { NavbarGroups } from "./component/Navbar/NavbarGroups";
import { IndexScene } from "./scene";

export const scenes: SceneDefinition[] = [
  {
    route: "/",
    component: IndexScene,
  },
  {
    route: "/dev",
    component: DevScene,
  },
  {
    route: "/docker/containers",
    component: DockerContainersScene,
    authCheck: can => can.read("container"),
    navbar: {
      title: "Containers",
      group: NavbarGroups.docker,
    },
  },
  {
    route: "/docker/hosts",
    component: DockerHostsScene,
    authCheck: can => can.read("host"),
    navbar: {
      title: "Hosts",
      group: NavbarGroups.docker,
    },
  },
];
