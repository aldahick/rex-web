import React from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IContainer, IMutationUpdateContainerPortsArgs } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";
import { TableForm } from "../TableForm";

const MUTATION_UPDATE_CONTAINER_PORTS = gql`
mutation Web_UpdateContainerPorts($containerId: String!, $ports: [ContainerPortInput!]!) {
  updateContainerPorts(containerId: $containerId, ports: $ports)
}
`;

interface EditContainerVariablesFormProps {
  container: IContainer;
  onSubmit: () => Promise<any>;
}

const toNumberOrUndefined = (value: string | undefined): number | undefined => {
  if (!value) { return undefined; }
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

export const EditContainerPortsForm: React.FC<EditContainerVariablesFormProps> = ({ container, onSubmit }) => {
  const [updateContainerPorts] = useMutation<{}, IMutationUpdateContainerPortsArgs>(MUTATION_UPDATE_CONTAINER_PORTS);

  return (
    <TableForm
      columns={{
        containerPort: {},
        hostPort: {
          isOptional: true,
        },
        hostBindIp: {
          isOptional: true,
        },
      }}
      rows={container.ports.map(p => ({
        containerPort: p.containerPort.toString(),
        hostPort: p.hostPort?.toString() || "",
        hostBindIp: p.hostBindIp || "",
      }))}
      onSubmit={async ports => {
        await callMutationSafe(updateContainerPorts, {
          containerId: container._id,
          ports: ports.map(p => ({
            containerPort: Number(p.containerPort),
            hostPort: toNumberOrUndefined(p.hostPort),
            hostBindIp: p.hostBindIp || undefined,
          })),
        });
        await onSubmit();
        return `Successfully updated variables for container "${container.name}"`;
      }}
    />
  );
};
