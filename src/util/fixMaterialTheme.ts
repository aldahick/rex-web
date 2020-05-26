import { Theme } from "@material-ui/core";
import * as _ from "lodash";

export const fixMaterialTheme = (originalTheme: Theme): Theme => {
  const theme = _.cloneDeep(originalTheme);
  // fix font colors
  const typographyKeys = Object.keys(theme.typography) as Array<keyof (typeof theme)["typography"]>;
  for (const typographyKey of typographyKeys) {
    const value = theme.typography[typographyKey];
    if (value && typeof (value) === "object") {
      value.color = theme.palette.text.primary;
    }
  }
  (theme.palette as any).info = theme.palette.primary;
  (theme.palette as any).success = theme.palette.primary;
  (theme.palette as any).warning = theme.palette.primary;
  return theme;
};
