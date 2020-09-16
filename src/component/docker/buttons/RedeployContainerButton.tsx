import React from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@material-ui/core";
import gql from "graphql-tag";
import { IContainer, IMutationRedeployContainerArgs } from "../../../graphql/types";
import { useStores } from "../../../hook/useStores";
import { callMutationSafe } from "../../../util/graphql";

const MUTATION_REDEPLOY_CONTAINER = gql`
mutation Web_RedeployContainer($containerId: String!) {
  redeployContainer(containerId: $containerId)
}
`;

interface RedeployContainerButtonProps {
  container: IContainer;
  onSubmit: () => Promise<unknown>;
}

export const RedeployContainerButton: React.FC<RedeployContainerButtonProps> = ({ container, onSubmit }) => {
  const { statusStore } = useStores();
  const [deployContainer] = useMutation<unknown, IMutationRedeployContainerArgs>(MUTATION_REDEPLOY_CONTAINER);

  const onClick = async () => {
    try {
      await callMutationSafe(deployContainer, { containerId: container._id });
      await onSubmit();
      statusStore.setSuccessMessage(`Successfully redeployed container "${container.name}" to host "${container.host.name}"`);
    } catch (err) {
      statusStore.setErrorMessage(err instanceof Error ? err.message : err);
    }
  };

  return (
    <Button onClick={onClick} variant="outlined" color="primary">
      Deploy
    </Button>
  );
};
