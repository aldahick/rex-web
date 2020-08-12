import React from "react";
import { IconButton, Typography } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import gql from "graphql-tag";
import * as _ from "lodash";
import { useQuery } from "react-apollo";
import { IQuery, IQueryProgressArgs } from "../../graphql/types";
import { Grids } from "../util/Grids";
import { PopupMessage } from "../util/PopupMessage";

const QUERY_PROGRESS = gql`
query Web_Progress($id: String!) {
  progress(id: $id) {
    _id
    action
    createdAt
    status
    logs {
      createdAt
      text
    }
  }
}
`;

interface LiveProgressProps {
  progressId: string;
}

export const LiveProgress: React.FC<LiveProgressProps> = ({ progressId }) => {
  const progressResult = useQuery<{ progress: IQuery["progress"] }, IQueryProgressArgs>(QUERY_PROGRESS, { variables: { id: progressId } });
  if (progressResult.loading || !progressResult.data) {
    return (
      <Typography>
        Loading...
      </Typography>
    );
  }
  if (progressResult.error) {
    return <PopupMessage severity="error" text={`An error occurred: ${progressResult.error.message}`} />;
  }
  const { progress } = progressResult.data;
  return (
    <Grids direction="column">
      <>
        <Typography variant="subtitle1">
          Progress:
          {" "}
          {_.startCase(progress.action)}
        </Typography>
        <IconButton onClick={() => progressResult.refetch({ id: progressId })}>
          <RefreshIcon />
        </IconButton>
      </>
      <Typography>
        Status:
        {" "}
        {_.startCase(progress.status)}
      </Typography>
      {progress.logs.map((log => (
        <Typography key={new Date(log.createdAt).toISOString()}>
          {new Date(log.createdAt).toLocaleString()}
          :
          {" "}
          {log.text}
        </Typography>
      )))}
    </Grids>
  );
};
