import { IRummikubCardColor } from "../../graphql/types";
import BlackWildcardIcon from "../../images/rummikub/wildcard-black.png";
import BlueWildcardIcon from "../../images/rummikub/wildcard-blue.png";
import RedWildcardIcon from "../../images/rummikub/wildcard-red.png";
import YellowWildcardIcon from "../../images/rummikub/wildcard-yellow.png";

export const RummikubCardBackgroundColor = "#F9EFE3";

export const RummikubCardColors: {[key in IRummikubCardColor]: string} = {
  [IRummikubCardColor.Black]: "#000000",
  [IRummikubCardColor.Blue]: "#0283BD",
  [IRummikubCardColor.Red]: "#D31A28",
  [IRummikubCardColor.Yellow]: "#E8B301",
};

export const RummikubWildcardIcons: {[key in IRummikubCardColor]: string} = {
  [IRummikubCardColor.Black]: BlackWildcardIcon,
  [IRummikubCardColor.Blue]: BlueWildcardIcon,
  [IRummikubCardColor.Red]: RedWildcardIcon,
  [IRummikubCardColor.Yellow]: YellowWildcardIcon,
};
