import React from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IContainer, IMutationUpdateContainerVolumesArgs } from "../../graphql/types";
import { callMutationSafe, removeTypename } from "../../util/graphql";
import { TableForm } from "../util/TableForm";

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
      columns={{
        hostPath: {},
        containerPath: {},
      }}
      rows={container.volumes.map(removeTypename)}
      onSubmit={async volumes => {
        await callMutationSafe(updateContainerVolumes, {
          containerId: container._id,
          volumes,
        });
        await onSubmit();
        return `Successfully updated volumes for container "${container.name}"`;
      }}
    />
  );
};
