import { useQuery } from "@apollo/client";
import { Breadcrumbs, Grid, Link, Typography } from "@material-ui/core";
import gql from "graphql-tag";
import React from "react";
import { useRouteMatch } from "react-router";
import { Link as RouterLink } from "react-router-dom";

import { EditNoteForm } from "../component/notes/EditNoteForm";
import { IQuery, IQueryNoteArgs } from "../graphql";
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
    <Grid container direction="column">
      <Grid item>
        <Breadcrumbs>
          <Link component={RouterLink} to="/notes" color="inherit">
            Notes
          </Link>
          <Typography>
            {note.title}
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item>
        <EditNoteForm note={note} />
      </Grid>
    </Grid>
  ))(useQuery<{ note: IQuery["note"] }, IQueryNoteArgs>(QUERY_NOTE, {
    variables: {
      id: noteId,
    },
  }));
};
