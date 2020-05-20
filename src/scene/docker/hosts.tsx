import React from "react";
import gql from "graphql-tag";
import MUIDataTable from "mui-datatables";
import { useQuery } from "react-apollo";
import { AddHostForm } from "../../component/docker/AddHostForm";
import { IQuery } from "../../graphql/types";
import { createDTColumn } from "../../util/dataTable";
import { checkQueryResult } from "../../util/graphql";

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
