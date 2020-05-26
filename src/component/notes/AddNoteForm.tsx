import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IMutationCreateNoteArgs } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { callMutationSafe } from "../../util/graphql";
import { Grids } from "../util/Grids";

const MUTATION_CREATE_NOTE = gql`
mutation Web_CreateNote($title: String!) {
  note: createNote(title: $title) {
    _id
  }
}
`;

export const AddNoteForm: React.FC<{
  onSubmit: () => Promise<any>;
}> = ({ onSubmit }) => {
  const { statusStore } = useStores();
  const [createNote] = useMutation<{}, IMutationCreateNoteArgs>(MUTATION_CREATE_NOTE);
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
      statusStore.setErrorMessage(err.message);
    }
  };

  return (
    <Grids>
      <TextField
        placeholder="Title"
        onChange={evt => setTitle(evt.target.value)}
        value={title}
      />
      <Button onClick={submit}>Create Note</Button>
    </Grids>
  );
};
