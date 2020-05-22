import React from "react";
import { Typography } from "@material-ui/core";
import gql from "graphql-tag";
import MUIDataTable from "mui-datatables";
import { useMutation, useQuery } from "react-apollo";
import { AddContainerForm } from "../../component/docker/AddContainerForm";
import { RedeployContainerButton } from "../../component/docker/buttons/RedeployContainerButton";
import { StartStopContainerButton } from "../../component/docker/buttons/StartStopContainerButton";
import { EditContainerPortsForm } from "../../component/docker/EditContainerPortsForm";
import { EditContainerVariablesForm } from "../../component/docker/EditContainerVariablesForm";
import { EditContainerVolumesForm } from "../../component/docker/EditContainerVolumesForm";
import { Grids } from "../../component/util/Grids";
import { IContainer, IMutationDeleteContainersArgs, IQuery } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { createDTColumn } from "../../util/dataTable";
import { callMutationSafe, checkQueryResult } from "../../util/graphql";

const QUERY_CONTAINERS = gql`
query Web_Containers {
  containers {
    _id
    name
    image
    tag
    status
    networkName
    host {
      name
    }
    variables {
      name
      value
    }
    volumes {
      containerPath
      hostPath
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
  const { statusStore } = useStores();
  const containersResult = useQuery(QUERY_CONTAINERS);
  const [deleteContainers] = useMutation<{}, IMutationDeleteContainersArgs>(MUTATION_DELETE_CONTAINERS);

  const onDelete = async (containers: IContainer[]) => {
    if (containers.length === 0) {
      return;
    }
    try {
      await callMutationSafe(deleteContainers, { ids: containers.map(c => c._id) });
      statusStore.setSuccessMessage(`Successfully deleted ${containers.length} containers`);
    } catch (err) {
      statusStore.setErrorMessage(err.message);
    }
  };

  return checkQueryResult<{ containers: IQuery["containers"] }>(({ containers }, { refetch }) => {
    const columns = [
      createDTColumn("name"),
      createDTColumn("status"),
      createDTColumn("image"),
      createDTColumn("host.name", "Host"),
      createDTColumn("tag"),
      createDTColumn("networkName"),
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
                .catch(err => statusStore.setErrorMessage(err.message));
            },
            expandableRows: true,
            renderExpandableRow: (_, { dataIndex }) => (
              <tr>
                <td colSpan={columns.length + 1}>
                  <Grids itemProps={{ xs: 12, md: 6 }}>
                    {[{
                      label: "Environment Variables",
                      form: EditContainerVariablesForm,
                    }, {
                      label: "Ports",
                      form: EditContainerPortsForm,
                    }, {
                      label: "Volumes",
                      form: EditContainerVolumesForm,
                    }].map(({ label, form: Form }) => (
                      <Grids key={label} direction="column" alignItems="center">
                        <Typography variant="h5">
                          {label}
                        </Typography>
                        <Form
                          container={containers[dataIndex]}
                          onSubmit={refetch}
                        />
                      </Grids>
                    ))}
                  </Grids>
                </td>
              </tr>
            ),
          }}
        />
      </>
    );
  })(containersResult);
};
