import React from "react";
import { useQuery, useMutation } from "react-apollo";
import gql from "graphql-tag";
import MUIDataTable from "mui-datatables";
import { IQuery, IContainer } from "../../graphql/types";
import { checkQueryResult, callMutationSafe } from "../../util/graphql";
import { createDTColumn } from "../../util/dataTable";
import { AddContainerForm } from "../../component/docker/AddContainerForm";
import { useStatusMessages } from "../../util/statusMessages";
import { RedeployContainerButton } from "../../component/docker/buttons/RedeployContainerButton";
import { StartStopContainerButton } from "../../component/docker/buttons/StartStopContainerButton";
import { EditContainerVariablesForm } from "../../component/docker/EditContainerVariablesForm";

const QUERY_CONTAINERS = gql`
query Web_Containers {
  containers {
    _id
    name
    image
    tag
    status
    host {
      name
    }
    variables {
      name
      value
    }
    ports {
      containerPort
      hostPort
      hostBindIp
    }
  }
}
`;

const MUTATION_DELETE_CONTAINERS = gql`
mutation Web_DeleteContainers($ids: [String!]!) {
  deleteContainers(ids: $ids)
}
`;

export const DockerContainersScene: React.FC = () => {
  const containersResult = useQuery(QUERY_CONTAINERS);
  const [deleteContainers] = useMutation(MUTATION_DELETE_CONTAINERS);
  const statusMessages = useStatusMessages();

  const onDelete = async (containers: IContainer[]) => {
    if (containers.length === 0) {
      return;
    }
    try {
      await callMutationSafe(deleteContainers, { ids: containers.map(c => c._id) });
      statusMessages.setSuccessMessage(`Successfully deleted ${containers.length} containers`);
    } catch (err) {
      statusMessages.setErrorMessage(err.message);
    }
  };

  return checkQueryResult<{ containers: IQuery["containers"] }>(({ containers }, { refetch }) => {
    const columns = [
      createDTColumn("name"),
      createDTColumn("status"),
      createDTColumn("image"),
      createDTColumn("host.name", "Host"),
      createDTColumn("tag"),
      createDTColumn("_id", " ", {
        filter: false,
        sort: false,
        customBodyRender: (_, { rowIndex }) => (
          <>
            <StartStopContainerButton container={containers[rowIndex]} onSubmit={refetch} />
            <RedeployContainerButton container={containers[rowIndex]} onSubmit={refetch} />
          </>
        ),
      }),
    ];
    return (
      <>
        {statusMessages.render()}
        <AddContainerForm onSubmit={refetch} />
        <MUIDataTable
          columns={columns}
          data={containers}
          title="Containers"
          options={{
            onRowsDelete: (evt: any) => {
              const { data } = evt as { data: { dataIndex: number }[] };
              onDelete(data.map(d => containers[d.dataIndex]))
                .then(() => refetch())
                .catch(err => statusMessages.setErrorMessage(err.message));
            },
            expandableRows: true,
            renderExpandableRow: (_, { dataIndex }) => (
              <tr>
                <td colSpan={columns.length + 1}>
                  <EditContainerVariablesForm
                    container={containers[dataIndex]}
                    onSubmit={refetch}
                  />
                </td>
              </tr>
            ),
          }}
        />
      </>
    );
  })(containersResult);
};
