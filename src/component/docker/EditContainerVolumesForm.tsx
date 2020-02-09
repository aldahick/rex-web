import React from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IContainer, IMutationUpdateContainerVolumesArgs } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";
import { TableForm } from "../TableForm";

const MUTATION_UPDATE_CONTAINER_VOLUMES = gql`
mutation Web_UpdateContainerVolumes($containerId: String!, $volumes: [ContainerVolumeInput!]!) {
  updateContainerVolumes(containerId: $containerId, volumes: $volumes)
}
`;

interface EditContainerVolumesFormProps {
  container: IContainer;
  onSubmit: () => Promise<any>;
}

export const EditContainerVolumesForm: React.FC<EditContainerVolumesFormProps> = ({ container, onSubmit }) => {
  const [updateContainerVolumes] = useMutation<{}, IMutationUpdateContainerVolumesArgs>(MUTATION_UPDATE_CONTAINER_VOLUMES);

  return (
    <TableForm
      keys={["hostPath", "containerPath"]}
      rows={container.volumes}
      onSubmit={async volumes => {
        await callMutationSafe(updateContainerVolumes, {
          containerId: container._id,
          volumes: volumes.map(
            ({ containerPath, hostPath }) => ({ containerPath, hostPath }),
          ),
        });
        await onSubmit();
        return `Successfully updated volumes for container "${container.name}"`;
      }}
    />
  );
};
