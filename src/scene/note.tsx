import React from "react";
import { Breadcrumbs, Link, Typography } from "@material-ui/core";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { useRouteMatch } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { EditNoteForm } from "../component/notes/EditNoteForm";
import { Grids } from "../component/util/Grids";
import { IQuery, IQueryNoteArgs } from "../graphql/types";
import { checkQueryResult } from "../util/graphql";

const QUERY_NOTE = gql`
query Web_Note($id: String!) {
  note(id: $id) {
    _id
    createdAt
    title
    body
  }
}
`;

export const NoteScene: React.FC = () => {
  const { params: { noteId } } = useRouteMatch<{ noteId: string }>();

  return checkQueryResult<{ note: IQuery["note"] }>(({ note }) => (
    <Grids direction="column">
      <Breadcrumbs>
        <Link component={RouterLink} to="/notes" color="inherit">Notes</Link>
        <Typography>{note.title}</Typography>
      </Breadcrumbs>
      <EditNoteForm note={note} />
    </Grids>
  ))(useQuery<any, IQueryNoteArgs>(QUERY_NOTE, {
    variables: {
      id: noteId,
    },
  }));
};
