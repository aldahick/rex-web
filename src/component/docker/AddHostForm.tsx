import React from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { IMutationCreateHostArgs } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";
import { DialogForm } from "../DialogForm";

const MUTATION_CREATE_HOST = gql`
mutation Web_CreateHost($name: String!, $hostname: String!) {
  host: createHost(name: $name, hostname: $hostname) {
    _id
  }
}
`;

interface AddHostFormProps {
  onSubmit: () => void | Promise<any>;
}

export const AddHostForm: React.FC<AddHostFormProps> = ({ onSubmit }) => {
  const [createHost] = useMutation<{}, IMutationCreateHostArgs>(MUTATION_CREATE_HOST);

  return (
    <DialogForm
      fields={{
        name: {},
        hostname: {},
      }}
      title="Add Host"
      onSubmit={async ({ name, hostname }) => {
        await callMutationSafe(createHost, { name, hostname });
        await onSubmit();
        return `Successfully added host "${name}"`;
      }}
    />
  );
};
