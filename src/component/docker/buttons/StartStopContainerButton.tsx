import React from "react";
import { Button } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import {
  IContainer, IContainerStatus,
  IMutationStartContainerArgs, IMutationStopContainerArgs,
} from "../../../graphql/types";
import { useStores } from "../../../hook/useStores";
import { callMutationSafe } from "../../../util/graphql";

const MUTATION_START_CONTAINER = gql`
mutation Web_StartContainer($containerId: String!) {
  startContainer(containerId: $containerId)
}
`;

const MUTATION_STOP_CONTAINER = gql`
mutation Web_StopContainer($containerId: String!) {
  stopContainer(containerId: $containerId)
}
`;

interface StartStopContainerButtonProps {
  container: IContainer;
  onSubmit: () => Promise<unknown>;
}

export const StartStopContainerButton: React.FC<StartStopContainerButtonProps> = ({ container, onSubmit }) => {
  const { statusStore } = useStores();
  const [startContainer] = useMutation<unknown, IMutationStartContainerArgs>(MUTATION_START_CONTAINER);
  const [stopContainer] = useMutation<unknown, IMutationStopContainerArgs>(MUTATION_STOP_CONTAINER);

  const isStopping = container.status === IContainerStatus.Running || container.status === IContainerStatus.Starting;

  const onClick = async () => {
    try {
      await callMutationSafe(isStopping ? stopContainer : startContainer, {
        containerId: container._id,
      });
      await onSubmit();
      statusStore.setSuccessMessage(`Successfully ${isStopping ? "stopped" : "started"} container "${container.name}" on host "${container.host.name}"`);
    } catch (err) {
      statusStore.setErrorMessage(err instanceof Error ? err.message : err);
    }
  };

  return (
    <Button onClick={onClick} variant="outlined" color="primary">
      {isStopping ? "Stop" : "Start"}
    </Button>
  );
};
