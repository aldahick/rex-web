import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo";
import { Grid, Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as _ from "lodash";
import {
  User, Query, PermissionResource, Role, MutationSetUserRolesArgs,
} from "../../graphql/types";
import { UserState } from "../auth";
import { useStatusMessages } from "../../util/useStatusMessages";
import { checkQueryResult, callMutationSafe } from "../../util/graphql";

const QUERY_ROLES = gql`
query Web_Roles {
  roles {
    id
    name
  }
}
`;

const MUTATION_SET_USER_ROLES = gql`
mutation Web_SetUserRoles($userId: Int!, $roleIds: [Int!]!) {
  setUserRoles(userId: $userId, roleIds: $roleIds)
}
`;

export interface EditUserRolesFormProps {
  user: User;
  onSubmit: () => Promise<any>;
}

export const EditUserRolesForm: React.FC<EditUserRolesFormProps> = ({ user, onSubmit }) => {
  const rolesResult = useQuery(QUERY_ROLES);
  const [setUserRoles] = useMutation<{}, MutationSetUserRolesArgs>(MUTATION_SET_USER_ROLES);
  const [selectedRoles, setSelectedRoles] = useState(_.cloneDeep(user.roles || []));
  const statusMessages = useStatusMessages();

  const canEditUsers = UserState.isAuthorized([{
    action: "updateAny",
    resource: PermissionResource.User,
  }]);
  return checkQueryResult<{ roles: Query["roles"] }>(({ roles }) => {
    const submit = async () => {
      try {
        await callMutationSafe(setUserRoles, {
          userId: user.id,
          roleIds: selectedRoles.map((r) => r.id),
        });
        statusMessages.setSuccessMessage(`Successfully set roles for user ${user.email}`);
        await onSubmit();
      } catch (err) {
        statusMessages.setErrorMessage(err.message);
      }
    };

    return (
      <Grid container direction="column">
        {statusMessages.render()}
        <Grid item style={{ flexGrow: 1 }}>
          <Autocomplete
            disabled={!canEditUsers}
            multiple
            options={_.sortBy(
              roles.filter(
                (r1) => !selectedRoles.some((r2) => r2.id === r1.id),
              ),
              (r) => r.name,
            )}
            value={_.sortBy(selectedRoles, (r) => r.name)}
            getOptionLabel={(r: Role) => r.name}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="standard"
                label="Roles"
              />
            )}
            onChange={(evt, values) => { setSelectedRoles(values); }}
          />
        </Grid>
        {canEditUsers && (
          <Grid item>
            <Button onClick={submit} variant="outlined">
              Save
            </Button>
          </Grid>
        )}
      </Grid>
    );
  })(rolesResult);
};
