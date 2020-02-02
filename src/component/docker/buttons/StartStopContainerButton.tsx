import React from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { Button } from "@material-ui/core";
import { useStatusMessages } from "../../../util/statusMessages";
import { callMutationSafe } from "../../../util/graphql";
import {
  IMutationStartContainerArgs, IMutationStopContainerArgs, IContainer, IContainerStatus,
} from "../../../graphql/types";

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
  onSubmit: () => Promise<any>;
}

export const StartStopContainerButton: React.FC<StartStopContainerButtonProps> = ({ container, onSubmit }) => {
  const [startContainer] = useMutation<{}, IMutationStartContainerArgs>(MUTATION_START_CONTAINER);
  const [stopContainer] = useMutation<{}, IMutationStopContainerArgs>(MUTATION_STOP_CONTAINER);
  const statusMessages = useStatusMessages();

  const isStopping = container.status === IContainerStatus.Running || container.status === IContainerStatus.Starting;

  const onClick = async () => {
    try {
      await callMutationSafe(isStopping ? stopContainer : startContainer, {
        containerId: container._id,
      });
      await onSubmit();
      statusMessages.setSuccessMessage(`Successfully ${isStopping ? "stopped" : "started"} container "${container.name}" on host "${container.host.name}"`);
    } catch (err) {
      statusMessages.setErrorMessage(err.message);
    }
  };

  return (
    <>
      {statusMessages.render()}
      <Button onClick={onClick} variant="outlined" color="primary">
        {isStopping ? "Stop" : "Start"}
      </Button>
    </>
  );
};
