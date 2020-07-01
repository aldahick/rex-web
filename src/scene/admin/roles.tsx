import React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { RolesTable } from "../../component/admin/RolesTable";
import { IQuery } from "../../graphql/types";
import { checkQueryResult } from "../../util/graphql";

const QUERY_ROLES = gql`
query Web_Roles {
  roles {
    id
    name
    permissions {
      resource
      action
      attributes
    }
  }
}
`;

export const AdminRolesScene: React.FC = () => (
  checkQueryResult<{ roles: IQuery["roles"] }>(({ roles }, { refetch }) => (
    <RolesTable roles={roles} onChange={refetch} />
  ))(useQuery(QUERY_ROLES))
);
