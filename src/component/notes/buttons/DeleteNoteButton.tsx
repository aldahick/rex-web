import React from "react";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IMutationRemoveNoteArgs } from "../../../graphql/types";
import { useStores } from "../../../hook/useStores";
import { callMutationSafe } from "../../../util/graphql";

const MUTATION_REMOVE_NOTE = gql`
mutation Web_RemoveNote($id: String!) {
  removeNote(id: $id)
}
`;

export const DeleteNoteButton: React.FC<{
  noteId: string;
  onSubmit: () => Promise<any>;
}> = ({ noteId, onSubmit }) => {
  const { statusStore } = useStores();
  const [removeNote] = useMutation<{}, IMutationRemoveNoteArgs>(MUTATION_REMOVE_NOTE);

  const submit = async () => {
    // eslint-disable-next-line no-alert,no-restricted-globals
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }
    try {
      await callMutationSafe(removeNote, { id: noteId });
      await onSubmit();
      statusStore.setSuccessMessage(`Deleted note id=${noteId}`);
    } catch (err) {
      statusStore.setErrorMessage(err.message);
    }
  };

  return (
    <IconButton color="secondary" onClick={submit}>
      <DeleteIcon />
    </IconButton>
  );
};