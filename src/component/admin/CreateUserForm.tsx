import React from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IMutationCreateUserArgs } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { callMutationSafe } from "../../util/graphql";
import { DialogForm } from "../util/DialogForm";

const MUTATION_CREATE_USER = gql`
mutation Web_CreateUser($email: String!) {
  createUser(email: $email) {
    id
  }
}
`;

export interface AddUserFormProps {
  onSubmit: () => Promise<any>;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit }) => {
  const { statusStore } = useStores();
  const [createUser] = useMutation<{}, IMutationCreateUserArgs>(MUTATION_CREATE_USER);

  return (
    <DialogForm
      title="Add User"
      fields={{
        email: {},
      }}
      onSubmit={async ({ email }) => {
        try {
          await callMutationSafe(createUser, { email });
          statusStore.setSuccessMessage(`Created user "${email}"`);
          await onSubmit();
        } catch (err) {
          statusStore.setErrorMessage(err.message);
        }
      }}
    />
  );
};
