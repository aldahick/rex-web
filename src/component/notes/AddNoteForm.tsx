import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Grid, TextField } from "@material-ui/core";
import gql from "graphql-tag";
import { IMutationCreateNoteArgs } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { callMutationSafe } from "../../util/graphql";

const MUTATION_CREATE_NOTE = gql`
mutation Web_CreateNote($title: String!) {
  note: createNote(title: $title) {
    _id
  }
}
`;

export const AddNoteForm: React.FC<{
  onSubmit: () => Promise<unknown>;
}> = ({ onSubmit }) => {
  const { statusStore } = useStores();
  const [createNote] = useMutation<unknown, IMutationCreateNoteArgs>(MUTATION_CREATE_NOTE);
  const [title, setTitle] = useState<string>("");

  const submit = async () => {
    if (!title) {
      return;
    }
    try {
      await callMutationSafe(createNote, { title });
      await onSubmit();
      statusStore.setSuccessMessage(`Created note "${title}"`);
    } catch (err) {
      statusStore.setErrorMessage(err instanceof Error ? err.message : err);
    }
  };

  return (
    <Grid container>
      <Grid item>
        <TextField
          placeholder="Title"
          onChange={evt => setTitle(evt.target.value)}
          value={title}
        />
      </Grid>
      <Grid item>
        <Button onClick={submit}>
          Create Note
        </Button>
      </Grid>
    </Grid>
  );
};
