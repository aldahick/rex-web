import React from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IContainer, IMutationUpdateContainerVariablesArgs } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";
import { TableForm } from "../TableForm";

const MUTATION_UPDATE_CONTAINER_VARIABLES = gql`
mutation Web_UpdateContainerVariables($containerId: String!, $variables: [ContainerVariableInput!]!) {
  updateContainerVariables(containerId: $containerId, variables: $variables)
}
`;

interface EditContainerVariablesFormProps {
  container: IContainer;
  onSubmit: () => Promise<any>;
}

export const EditContainerVariablesForm: React.FC<EditContainerVariablesFormProps> = ({ container, onSubmit }) => {
  const [updateContainerVariables] = useMutation<{}, IMutationUpdateContainerVariablesArgs>(MUTATION_UPDATE_CONTAINER_VARIABLES);

  return (
    <TableForm
      keys={["name", "value"]}
      rows={container.variables}
      onSubmit={async variables => {
        await callMutationSafe(updateContainerVariables, {
          containerId: container._id,
          variables,
        });
        await onSubmit();
        return `Successfully updated variables for container "${container.name}"`;
      }}
    />
  );
};
