import React, { useState } from "react";
import { Grids } from "../component/util/Grids";
import { FetchWikiPagesForm } from "../component/wikiPages/FetchWikiPagesForm";
import { LiveProgress } from "../component/progress/LiveProgress";

export const WikiPagesScene: React.FC = () => {
  const [progressId, setProgressId] = useState<string>();

  return (
    <Grids>
      <FetchWikiPagesForm onFetch={setProgressId} />
      {progressId && <LiveProgress progressId={progressId} />}
    </Grids>
  );
};
