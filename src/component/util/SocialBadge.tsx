import { Grid, Link, Typography } from "@material-ui/core";
import React from "react";

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
    <Grid container alignItems="center" direction="column">
      <Grid item>
        <img src={imageUrl} height={32} alt="Logo" {...imageProps} />
      </Grid>
      {typeof label === "string" ? (
        <Grid item>
          <Typography color="inherit">
            {label}
          </Typography>
        </Grid>
      ) : label}
    </Grid>
  </Link>
);
