import MUIDataTable from "mui-datatables";
import React from "react";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import { IQuery } from "../../graphql/types";
import { checkQueryResult } from "../../util/graphql";
import { createDTColumn } from "../../util/dataTable";
import { AddHostForm } from "../../component/docker/AddHostForm";

const QUERY_HOSTS = gql`
query Web_Hosts {
  hosts {
    _id
    name
    hostname
  }
}
`;

export const DockerHostsScene: React.FC = () => {
  const hostsResult = useQuery(QUERY_HOSTS);

  return checkQueryResult<{ hosts: IQuery["hosts"] }>(({ hosts }, { refetch }) => (
    <>
      <AddHostForm onSubmit={refetch} />
      <MUIDataTable
        columns={[
          createDTColumn("name"),
          createDTColumn("hostname"),
        ]}
        data={hosts}
        title="Hosts"
      />
    </>
  ))(hostsResult);
};
