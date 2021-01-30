import { IFeature } from "../../IFeature";
import { MediaPage } from "./media.page";

export const mediaFeature: IFeature = {
  pages: [
    {
      route: "/media",
      component: MediaPage,
      authCheck: can => can.read("mediaItem"),
      navbar: {
        title: "Media",
      },
    },
  ]
};
