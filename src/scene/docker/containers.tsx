import { useMutation, useQuery } from "@apollo/client";
import { Grid, Typography } from "@material-ui/core";
import gql from "graphql-tag";
import MUIDataTable from "mui-datatables";
import React from "react";

import { AddContainerForm } from "../../component/docker/AddContainerForm";
import { RedeployContainerButton } from "../../component/docker/buttons/RedeployContainerButton";
import { StartStopContainerButton } from "../../component/docker/buttons/StartStopContainerButton";
import { EditContainerPortsForm } from "../../component/docker/EditContainerPortsForm";
import { EditContainerVariablesForm } from "../../component/docker/EditContainerVariablesForm";
import { EditContainerVolumesForm } from "../../component/docker/EditContainerVolumesForm";
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
  const [deleteContainers] = useMutation<unknown, IMutationDeleteContainersArgs>(MUTATION_DELETE_CONTAINERS);

  const onDelete = async (containers: IContainer[]) => {
    if (containers.length === 0) {
      return;
    }
    try {
      await callMutationSafe(deleteContainers, { ids: containers.map(c => c._id) });
      statusStore.setSuccessMessage(`Successfully deleted ${containers.length} containers`);
    } catch (err) {
      statusStore.setErrorMessage(err instanceof Error ? err.message : err);
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
            onRowsDelete: evt => {
              const { data } = evt as { data: { dataIndex: number }[] };
              onDelete(data.map(d => containers[d.dataIndex]))
                .then(() => refetch())
                .catch(err => statusStore.setErrorMessage(err instanceof Error ? err.message : err));
            },
            expandableRows: true,
            renderExpandableRow: (_, { dataIndex }) => (
              <tr>
                <td colSpan={columns.length + 1}>
                  <Grid container>
                    {[{
                      label: "Environment Variables",
                      form: EditContainerVariablesForm,
                    }, {
                      label: "Ports",
                      form: EditContainerPortsForm,
                    }, {
                      label: "Volumes",
                      form: EditContainerVolumesForm,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    }].map(({ label, form: Form }) => (
                      <Grid item key={label} xs={12} md={6}>
                        <Grid container direction="column" alignItems="center">
                          <Grid item>
                            <Typography variant="h5">
                              {label}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Form
                              container={containers[dataIndex]}
                              onSubmit={refetch}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </td>
              </tr>
            ),
          }}
        />
      </>
    );
  })(containersResult);
};
