import React from "react";
import { Link, Typography } from "@material-ui/core";
import { Grids } from "./Grids";

interface SocialBadgeProps {
  label: React.ReactNode;
  imageUrl: string;
  url?: string;
  imageProps?: Partial<React.ImgHTMLAttributes<HTMLImageElement>>;
}

export const SocialBadge: React.FC<SocialBadgeProps> = ({
  label, imageUrl, url, imageProps,
}) => (
  <Link href={url}>
    <Grids alignItems="center" direction="column">
      <img src={imageUrl} height={32} alt="Logo" {...imageProps} />
      {typeof label === "string" ? (
        <Typography color="inherit">
          {label}
        </Typography>
      ) : label}
    </Grids>
  </Link>
);
