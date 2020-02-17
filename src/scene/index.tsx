import React from "react";
import {
  TypographyProps, Typography, Link, Grid,
} from "@material-ui/core";
import { Grids } from "../component/util/Grids";
import { SocialBadge } from "../component/util/SocialBadge";
import githubLogoUrl from "../images/logos/github.png";
import linkedInLogoUrl from "../images/logos/linkedin.png";

const Line = ({ children, ...props }: { children: React.ReactNode } & Omit<TypographyProps, "children">) => (
  <Typography style={{ textAlign: "center" }} {...props}>{children}</Typography>
);

export const IndexScene: React.FC = () => (
  <Grid container direction="column" alignItems="center">
    <Grid item>
      <Line variant="h5">
        <Link href="https://github.com/aldahick">Alex Hicks</Link>
      </Line>
      <Line>I&apos;m not a designer, forgive the atrocious visuals.</Line>
      <Line>
        I
        {" "}
        <strong>am</strong>
        {" "}
        a software engineer.
      </Line>
      <Line>This site is part of a small ecosystem of personal projects:</Line>
      <Line>
        <Link href="https://github.com/search?q=user%3Aaldahick+rex-">Rex</Link>
      </Line>
    </Grid>
    <Grid item style={{ marginTop: "1em" }}>
      <Grids justify="center" spacing={4}>
        <SocialBadge
          imageUrl={githubLogoUrl}
          url="https://github.com/aldahick"
          label="@aldahick"
        />
        <SocialBadge
          imageUrl={linkedInLogoUrl}
          url="https://linkedin.com/in/aldahick"
          label="@aldahick"
        />
      </Grids>
    </Grid>
  </Grid>
);
