import React from "react";
import { Button } from "@material-ui/core";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IContainer, IMutationRedeployContainerArgs } from "../../../graphql/types";
import { callMutationSafe } from "../../../util/graphql";
import { useStatusMessages } from "../../../util/statusMessages";

const MUTATION_REDEPLOY_CONTAINER = gql`
mutation Web_RedeployContainer($containerId: String!) {
  redeployContainer(containerId: $containerId)
}
`;

interface RedeployContainerButtonProps {
  container: IContainer;
  onSubmit: () => Promise<any>;
}

export const RedeployContainerButton: React.FC<RedeployContainerButtonProps> = ({ container, onSubmit }) => {
  const [deployContainer] = useMutation<{}, IMutationRedeployContainerArgs>(MUTATION_REDEPLOY_CONTAINER);
  const statusMessages = useStatusMessages();

  const onClick = async () => {
    try {
      await callMutationSafe(deployContainer, { containerId: container._id });
      await onSubmit();
      statusMessages.setSuccessMessage(`Successfully redeployed container "${container.name}" to host "${container.host.name}"`);
    } catch (err) {
      statusMessages.setErrorMessage(err.message);
    }
  };

  return (
    <>
      {statusMessages.render()}
      <Button onClick={onClick} variant="outlined" color="primary">Deploy</Button>
    </>
  );
};
