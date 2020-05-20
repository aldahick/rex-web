import React, { useState } from "react";
import { IconButton, Typography } from "@material-ui/core";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { IMediaItem } from "../../graphql/types";
import { Grids } from "../util/Grids";
import { MediaContentView } from "./MediaContentView";

interface MediaSeriesProps {
  selectedKey: string;
  items: IMediaItem[];
}

export const MediaSeries: React.FC<MediaSeriesProps> = ({ selectedKey, items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeSetIndex = (value: number) => {
    setCurrentIndex(Math.min(Math.max(value, 0), items.length - 1));
  };

  return (
    <Grids direction="column">
      <Grids justify="space-around">
        <IconButton onClick={() => safeSetIndex(currentIndex - 1)}>
          <ArrowLeftIcon />
        </IconButton>
        <Typography>
          {currentIndex + 1}
          {" "}
          /
          {" "}
          {items.length}
        </Typography>
        <IconButton onClick={() => safeSetIndex(currentIndex + 1)}>
          <ArrowRightIcon />
        </IconButton>
      </Grids>
      <MediaContentView
        onClick={() => safeSetIndex(currentIndex + 1)}
        selectedKey={`${selectedKey}/${items[currentIndex].key}`}
      />
    </Grids>
  );
};
