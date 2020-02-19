import React from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { IMutationCreateContainerArgs } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";
import { HostSelect } from "./HostSelect";
import { DialogForm } from "../util/DialogForm";

const MUTATION_CREATE_CONTAINER = gql`
mutation Web_CreateContainer($container: CreateContainerInput!) {
  container: createContainer(container: $container) {
    _id
  }
}
`;

interface AddContainerFormProps {
  onSubmit: () => void | Promise<any>;
}

export const AddContainerForm: React.FC<AddContainerFormProps> = ({ onSubmit }) => {
  const [createContainer] = useMutation<{}, IMutationCreateContainerArgs>(MUTATION_CREATE_CONTAINER);

  return (
    <DialogForm
      fields={{
        name: {},
        image: {},
        tag: {},
        networkName: {},
        hostId: {
          render: onChange => <HostSelect onChange={host => onChange(host._id)} />,
        },
      }}
      title="Add Container"
      onSubmit={async container => {
        await callMutationSafe(createContainer, { container });
        await onSubmit();
        return `Successfully added container "${container.name}"`;
      }}
    />
  );
};
