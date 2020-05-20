import { NavbarGroups } from "./component/Navbar/NavbarGroups";
import { IndexScene } from "./scene";
import { DevScene } from "./scene/dev";
import { DockerContainersScene } from "./scene/docker/containers";
import { DockerHostsScene } from "./scene/docker/hosts";
import { LoginScene } from "./scene/login";
import { MediaScene } from "./scene/media";
import { SettingsScene } from "./scene/settings";
import { WikiPagesScene } from "./scene/wikiPages";
import { SceneDefinition } from "./util/SceneDefinition";

export const scenes: SceneDefinition[] = [
  {
    route: "/",
    component: IndexScene,
  },
  {
    route: "/login",
    component: LoginScene,
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
  {
    route: "/media",
    component: MediaScene,
    authCheck: can => can.read("mediaItem"),
    navbar: {
      title: "Media",
    },
  },
  {
    route: "/wikiPages",
    component: WikiPagesScene,
    authCheck: can => can.read("wikiPage"),
    navbar: {
      title: "Wiki Pages",
    },
  },
  {
    route: "/settings",
    component: SettingsScene,
    navbar: {
      title: "Settings",
    },
  },
];
