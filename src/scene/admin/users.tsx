import React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { UsersTable } from "../../component/admin/UsersTable";
import { IQuery } from "../../graphql/types";
import { checkQueryResult } from "../../util/graphql";

const QUERY_USERS = gql`
query Web_Users {
  users {
    id
    email
    isEnabled
    roles {
      id
      name
    }
  }
}
`;

export const AdminUsersScene: React.FC = () => {
  const usersResult = useQuery(QUERY_USERS);

  return checkQueryResult<{ users: IQuery["users"] }>(({ users }, { refetch }) => (
    <UsersTable
      users={users}
      onChange={refetch}
    />
  ))(usersResult);
};
