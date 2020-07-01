import React from "react";
import gql from "graphql-tag";
import MUIDataTable from "mui-datatables";
import { useMutation } from "react-apollo";
import { MutationDeleteRoleArgs, PermissionResource, Role } from "../../graphql/types";
import { createDTColumn } from "../../util/dataTable";
import { callMutationSafe } from "../../util/graphql";
import { useStatusMessages } from "../../util/useStatusMessages";
import { SecureComponent } from "../auth";
import { AddRoleForm } from "./CreateRoleForm";
import { EditRolePermissionsForm } from "./EditRolePermissionsForm";

const MUTATION_DELETE_ROLE = gql`
mutation Web_DeleteRole($id: Int!) {
  deleteRole(id: $id)
}
`;

export interface RolesTableProps {
  roles: Role[];
  onChange: () => Promise<any>;
}

export const RolesTable: React.FC<RolesTableProps> = ({ roles, onChange }) => {
  const [deleteRole] = useMutation<{}, MutationDeleteRoleArgs>(MUTATION_DELETE_ROLE);
  const statusMessages = useStatusMessages();

  const onDelete = async (indices: { data: { dataIndex: number }[] }) => {
    try {
      for (const { dataIndex } of indices.data) {
        const role = roles[dataIndex];
        if (!role) {
          throw new Error(`Missing role index=${dataIndex}, unsafe to delete. Operation aborted.`);
        }
        await callMutationSafe(deleteRole, { id: role.id });
      }
      statusMessages.setSuccessMessage(`Successfully deleted ${indices.data.length} roles`);
      await onChange();
    } catch (err) {
      statusMessages.setErrorMessage(err.message);
    }
  };

  return (
    <SecureComponent
      check={[{
        action: "readAny",
        resource: PermissionResource.Role,
      }]}
    >
      {statusMessages.render()}
      <MUIDataTable
        title="Manage Roles"
        columns={[
          createDTColumn("name"),
          createDTColumn("permissions", undefined, {
            sort: false,
            filter: false,
            customBodyRender: (v, { rowIndex }) => (
              <EditRolePermissionsForm
                role={roles[rowIndex]}
                onSubmit={onChange}
              />
            ),
          }),
        ]}
        data={roles}
        options={{
          rowHover: false,
          print: false,
          download: false,
          onRowsDelete: onDelete as any,
        }}
      />
      <AddRoleForm onSubmit={onChange} />
    </SecureComponent>
  );
};
