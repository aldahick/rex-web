import React, { useState } from "react";
import { LiveProgress } from "../component/progress/LiveProgress";
import { Grids } from "../component/util/Grids";
import { FetchWikiPagesForm } from "../component/wikiPages/FetchWikiPagesForm";

export const WikiPagesScene: React.FC = () => {
  const [progressId, setProgressId] = useState<string>();

  return (
    <Grids>
      <FetchWikiPagesForm onFetch={setProgressId} />
      {progressId !== undefined && <LiveProgress progressId={progressId} />}
    </Grids>
  );
};
