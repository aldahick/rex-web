import { makeStyles } from "@material-ui/core";
import React from "react";

import { IRummikubCardColor } from "../../graphql/types";
import { RummikubCardBackgroundColor, RummikubCardColors, RummikubWildcardIcons } from "./RummikubCardColors";

const useStyles = makeStyles({
  root: {
    backgroundColor: RummikubCardBackgroundColor,
    width: "50px",
    height: "75px",
    display: "inline-block",
    border: "1px solid gray",
    borderRadius: "3px",
  },
  container: {
    display: "flex",
    height: "75%",
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontWeight: "bold",
    fontSize: "32px",
  },
});

export const RummikubCard: React.FC<{
  rootProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  color: IRummikubCardColor;
  value?: number;
}> = ({ rootProps, color, value }) => {
  const classes = useStyles();

  return (
    <div className={classes.root} {...rootProps}>
      <div className={classes.container}>
        {value !== undefined ? (
          <span
            className={classes.value}
            style={{ color: RummikubCardColors[color] }}
          >
            {value}
          </span>
        ) : (
          <img width={32} src={RummikubWildcardIcons[color]} alt="Wildcard" />
        )}
      </div>
    </div>
  );
};
