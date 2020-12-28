import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";

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
  onSubmit: () => Promise<unknown>;
}

export const EditContainerVolumesForm: React.FC<EditContainerVolumesFormProps> = ({ container, onSubmit }) => {
  const [updateContainerVolumes] = useMutation<unknown, IMutationUpdateContainerVolumesArgs>(MUTATION_UPDATE_CONTAINER_VOLUMES);

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
