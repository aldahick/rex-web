import { IndexScene } from "./scene";
import { DevScene } from "./scene/dev";
import { LoginScene } from "./scene/login";
import { MediaScene } from "./scene/media";
import { NoteScene } from "./scene/note";
import { NotesScene } from "./scene/notes";
import { SceneDefinition } from "./util/SceneDefinition";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
    route: "/media",
    component: MediaScene,
    authCheck: can => can.read("mediaItem"),
    navbar: {
      title: "Media",
    },
  },
  {
    route: "/notes",
    component: NotesScene,
    authCheck: can => can.readOwn("note"),
    navbar: {
      title: "Notes",
    },
  },
  {
    route: "/notes/:noteId",
    component: NoteScene,
    authCheck: can => can.readOwn("note"),
  }
];
