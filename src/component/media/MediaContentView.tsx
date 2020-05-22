import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import * as mime from "mime";
import { isIOS } from "react-device-detect";
import { Config } from "../../Config";
import { UserState } from "../auth";
import { FetchUrl } from "../util/FetchUrl";

const useStyles = makeStyles({
  text: {
    whiteSpace: "pre-wrap",
  },
  image: {
    maxWidth: "100%",
  },
});

interface MediaContentViewProps {
  selectedKey: string;
  onClick?: () => void;
}

export const MediaContentView: React.FC<MediaContentViewProps> = ({ onClick, selectedKey }) => {
  const classes = useStyles();

  const mimeType = mime.getType(selectedKey);
  const contentUrl = `${Config.apiUrl}/v1/media/content?key=${selectedKey}&token=${UserState.token}`;

  switch (mimeType) {
    case "audio/mp4":
    case "audio/mpeg":
      return (
        <audio
          controls
          autoPlay
          src={contentUrl}
        />
      );
    case "video/mp4":
    case "video/quicktime":
      return (
        <video
          playsInline
          controls
          autoPlay
          muted={isIOS}
          src={contentUrl}
          className={classes.image}
        />
      );
    case "image/jpg":
    case "image/jpeg":
    case "image/png":
      return (
        <img
          alt={selectedKey}
          src={contentUrl}
          className={classes.image}
          {...(onClick ? { onClick } : { })}
        />
      );
    case "text/html":
    case "text/plain":
      return (
        <FetchUrl url={contentUrl}>
          {text => (
            mimeType === "text/html" ? (
              // eslint-disable-next-line react/no-danger
              <div dangerouslySetInnerHTML={{ __html: text }} />
            ) : (
              <div className={classes.text}>
                {text}
              </div>
            )
          )}
        </FetchUrl>
      );
    default:
      return (
        <Typography>
          Unknown MIME type
          {" "}
          {mimeType}
        </Typography>
      );
  }
};
