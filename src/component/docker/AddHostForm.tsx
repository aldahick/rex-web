import React from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { IMutationCreateHostArgs } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";
import { DialogForm } from "../util/DialogForm";

const MUTATION_CREATE_HOST = gql`
mutation Web_CreateHost($host: CreateHostInput!) {
  createHost(host: $host) {
    _id
  }
}
`;

interface AddHostFormProps {
  onSubmit: () => undefined | Promise<unknown>;
}

export const AddHostForm: React.FC<AddHostFormProps> = ({ onSubmit }) => {
  const [createHost] = useMutation<unknown, IMutationCreateHostArgs>(MUTATION_CREATE_HOST);

  return (
    <DialogForm
      fields={{
        name: {},
        hostname: {},
        dockerEndpoint: {},
      }}
      title="Add Host"
      onSubmit={async ({ name, hostname, dockerEndpoint }) => {
        await callMutationSafe(createHost, {
          host: { name, hostname, dockerEndpoint },
        });
        await onSubmit();
        return `Successfully added host "${name}"`;
      }}
    />
  );
};
