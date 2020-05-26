import React from "react";
import { Typography } from "@material-ui/core";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { useRouteMatch } from "react-router";
import { Grids } from "../component/util/Grids";
import { IQuery, IQueryNoteArgs } from "../graphql/types";
import { checkQueryResult } from "../util/graphql";

const QUERY_NOTE = gql`
query Web_Note($id: String!) {
  note(id: $id) {
    createdAt
    title
    body
  }
}
`;

export const NoteScene: React.FC = () => {
  const { params: { noteId } } = useRouteMatch<{ noteId: string }>();

  return checkQueryResult<{ note: IQuery["note"] }>(({ note }) => (
    <Grids>
      <Typography>{note.title}</Typography>
      <Typography>WIP</Typography>
    </Grids>
  ))(useQuery<any, IQueryNoteArgs>(QUERY_NOTE, {
    variables: {
      id: noteId,
    },
  }));
};
