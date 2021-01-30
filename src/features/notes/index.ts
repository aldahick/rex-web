import { IFeature } from "../../IFeature";
import { NoteScene } from "./note.page";
import { NotesScene } from "./notes.page";

export const notesFeature: IFeature = {
  pages: [
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
  ]
};
