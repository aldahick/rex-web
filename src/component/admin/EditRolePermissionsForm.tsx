import React, { useState } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import gql from "graphql-tag";
import * as _ from "lodash";
import { useMutation } from "react-apollo";
import {
  IMutationSetRolePermissionsArgs,
  IRole, IRolePermission,
} from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { callMutationSafe } from "../../util/graphql";
import { UserState } from "../auth";

const MUTATION_SET_ROLE_PERMISSIONS = gql`
mutation Web_SetRolePermissions($roleId: Int!, $permissions: [RolePermissionInput!]!) {
  setRolePermissions(roleId: $roleId, permissions: $permissions)
}
`;

export interface EditRolePermissionsFormProps {
  role: IRole;
  onSubmit: () => Promise<any>;
}

export const EditRolePermissionsForm: React.FC<EditRolePermissionsFormProps> = (
  { role, onSubmit },
) => {
  const { statusStore } = useStores();
  const [permissions, setPermissions] = useState(_.cloneDeep(role.permissions || []));
  const [setRolePermissions] = useMutation<{}, IMutationSetRolePermissionsArgs>(
    MUTATION_SET_ROLE_PERMISSIONS,
  );

  const submit = async () => {
    try {
      await callMutationSafe(setRolePermissions, {
        roleId: role._id,
        permissions: permissions.map(p => _.omit(p, "__typename")),
      });
      statusStore.setSuccessMessage(`Successfully updated permissions for role "${role.name}"`);
      await onSubmit();
    } catch (err) {
      statusStore.setErrorMessage(err.message);
    }
  };

  const canEditRoles = UserState.isAuthorized(can => can.updateAny("role"));

  return (
    <Grid container direction="column">
      {statusMessages.render()}
      <Grid item style={{ flexGrow: 1 }}>
        <Autocomplete
          disabled={!canEditRoles}
          multiple
          options={_.sortBy(_.flatten(["read:any", "update:any", "delete:any", "create:any"].map(action => (
            Object.values(PermissionResource).map(resource => ({
              resource,
              action,
              attributes: "*",
            }))
          ))), ["resource", "action"])}
          value={_.sortBy(permissions, ["resource", "action"])}
          groupBy={(p: IRolePermission) => _.startCase(p.resource)}
          getOptionLabel={(p: IRolePermission) => `${_.startCase(p.resource)} : ${_.startCase(p.action.split(":")[0])}`}
          renderInput={params => (
            <TextField
              {...params}
              fullWidth
              variant="standard"
              label="Permissions"
            />
          )}
          onChange={(evt, values) => { setPermissions(values); }}
        />
      </Grid>
      {canEditRoles && (
        <Grid item>
          <Button onClick={submit} variant="outlined">
            Save
          </Button>
        </Grid>
      )}
    </Grid>
  );
};
