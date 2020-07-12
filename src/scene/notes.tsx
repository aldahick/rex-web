import React from "react";
import {
  Grid, Link, TableCell, TableRow,
} from "@material-ui/core";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { Link as RouterLink } from "react-router-dom";
import { AddNoteForm } from "../component/notes/AddNoteForm";
import { DeleteNoteButton } from "../component/notes/buttons/DeleteNoteButton";
import { Table } from "../component/util/Table";
import { IQuery } from "../graphql/types";
import { checkQueryResult } from "../util/graphql";

const QUERY_NOTES = gql`
query Web_Notes {
  notes {
    _id
    createdAt
    title
  }
}
`;

export const NotesScene: React.FC = () => (
  checkQueryResult<{ notes: IQuery["notes"] }>(({ notes }, { refetch }) => (
    <Grid container direction="column">
      <Grid item>
        <AddNoteForm onSubmit={refetch} />
      </Grid>
      <Grid item xl={2} lg={3} md={4} sm={6}>
        <Table columns={["Title", "Created At"]}>
          {notes.map(note => (
            <TableRow key={note._id}>
              <TableCell>
                <Link component={RouterLink} to={`/notes/${note._id}`}>
                  {note.title}
                </Link>
              </TableCell>
              <TableCell>{new Date(note.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <DeleteNoteButton noteId={note._id} onSubmit={refetch} />
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Grid>
    </Grid>
  ))(useQuery(QUERY_NOTES))
);
