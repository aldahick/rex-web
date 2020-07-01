import React from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IMutationCreateRoleArgs } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { callMutationSafe } from "../../util/graphql";
import { DialogForm } from "../util/DialogForm";

const MUTATION_CREATE_ROLE = gql`
mutation Web_CreateRole($name: String!) {
  createRole(name: $name) {
    id
  }
}
`;

export interface AddRoleFormProps {
  onSubmit: () => Promise<any>;
}

export const AddRoleForm: React.FC<AddRoleFormProps> = ({ onSubmit }) => {
  const { statusStore } = useStores();
  const [createRole] = useMutation<{}, IMutationCreateRoleArgs>(MUTATION_CREATE_ROLE);

  return (
    <DialogForm
      title="Create Role"
      fields={{
        name: {},
      }}
      onSubmit={async ({ name }) => {
        try {
          await callMutationSafe(createRole, { name });
          statusStore.setSuccessMessage(`Created role "${name}"`);
          await onSubmit();
        } catch (err) {
          statusStore.setErrorMessage(err.message);
        }
      }}
    />
  );
};
