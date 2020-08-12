import { Theme } from "@material-ui/core";
import { PaletteColor } from "@material-ui/core/styles/createPalette";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import * as _ from "lodash";

export const fixMaterialTheme = (originalTheme: Theme): Theme => {
  const theme = _.cloneDeep(originalTheme) as Theme & {
    palette: Theme["palette"] & {
      info: PaletteColor;
      success: PaletteColor;
      warning: PaletteColor;
    };
  };

  // fix font colors
  const typographyKeys = Object.keys(theme.typography) as (keyof (typeof theme)["typography"])[];
  for (const typographyKey of typographyKeys) {
    const value = theme.typography[typographyKey];
    if (value !== undefined && typeof value === "object") {
      (value as CSSProperties).color = theme.palette.text.primary;
    }
  }
  theme.palette.info = theme.palette.primary;
  theme.palette.success = theme.palette.primary;
  theme.palette.warning = theme.palette.primary;
  return theme;
};
