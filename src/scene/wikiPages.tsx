import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { LiveProgress } from "../component/progress/LiveProgress";
import { FetchWikiPagesForm } from "../component/wikiPages/FetchWikiPagesForm";

export const WikiPagesScene: React.FC = () => {
  const [progressId, setProgressId] = useState<string>();

  return (
    <Grid container>
      <Grid item>
        <FetchWikiPagesForm onFetch={setProgressId} />
      </Grid>
      {progressId !== undefined && (
        <Grid item>
          <LiveProgress progressId={progressId} />
        </Grid>
      )}
    </Grid>
  );
};
