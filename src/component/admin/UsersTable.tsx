import React from "react";
import MUIDataTable from "mui-datatables";
import { PermissionResource, User } from "../../graphql/types";
import { createDTColumn } from "../../util/dataTable";
import { SecureComponent } from "../auth";
import { ToggleUserEnabledButton } from "./buttons/ToggleUserEnabledButton";
import { AddUserForm } from "./CreateUserForm";
import { EditUserRolesForm } from "./EditUserRolesForm";

export interface UsersTableProps {
  onChange: () => Promise<any>;
  users: User[];
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, onChange }) => (
  <SecureComponent
    check={[{
      action: "readAny",
      resource: PermissionResource.User,
    }]}
  >
    <MUIDataTable
      title="Manage Users"
      data={users}
      columns={[
        createDTColumn("email"),
        createDTColumn("isEnabled", "Enabled?", {
          sort: false,
          customBodyRender: (v, { rowIndex }) => (
            <ToggleUserEnabledButton user={users[rowIndex]} onSubmit={onChange} />
          ),
        }),
        createDTColumn("roles", " ", {
          filter: false,
          sort: false,
          customBodyRender: (v, { rowIndex }) => (
            <EditUserRolesForm user={users[rowIndex]} onSubmit={onChange} />
          ),
        }),
      ]}
      options={{
        selectableRows: "none",
        print: false,
        download: false,
      }}
    />
    <AddUserForm onSubmit={onChange} />
  </SecureComponent>
);
