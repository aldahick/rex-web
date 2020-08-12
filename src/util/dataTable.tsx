import React from "react";
import { Typography } from "@material-ui/core";
import * as _ from "lodash";
import { MUIDataTableColumn } from "mui-datatables";

export const createDTColumn = (
  name: string,
  label = _.startCase(name),
  options: MUIDataTableColumn["options"] = {},
): MUIDataTableColumn => ({
  name,
  label,
  options: {
    customBodyRender: value => (
      <Typography>
        {value}
      </Typography>
    ),
    ...options,
  },
});
