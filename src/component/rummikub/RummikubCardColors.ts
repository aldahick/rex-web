import { IRummikubCardColor } from "../../graphql/types";

export const RummikubCardBackgroundColor = "#F9EFE3";

export const RummikubCardColors: {[key in IRummikubCardColor]: string} = {
  [IRummikubCardColor.Black]: "#000000",
  [IRummikubCardColor.Blue]: "#0283BD",
  [IRummikubCardColor.Red]: "#D31A28",
  [IRummikubCardColor.Yellow]: "#E8B301",
};
