import * as _ from "lodash";
import React, { useState } from "react";
import {
  TableRow, TableCell, Button, TextField, IconButton, Grid,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { useStatusMessages } from "../../util/statusMessages";
import { Table } from "../Table";
import { IContainer, IMutationUpdateContainerVariablesArgs } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";

const MUTATION_UPDATE_CONTAINER_VARIABLES = gql`
mutation Web_UpdateContainerVariables($containerId: String!, $variables: [ContainerVariableInput!]!) {
  updateContainerVariables(containerId: $containerId, variables: $variables)
}
`;

interface EditContainerVariablesFormProps {
  container: IContainer;
  onSubmit: () => Promise<any>;
}

export const EditContainerVariablesForm: React.FC<EditContainerVariablesFormProps> = ({ container, onSubmit }) => {
  const statusMessages = useStatusMessages();
  const [updateContainerVariables] = useMutation<{}, IMutationUpdateContainerVariablesArgs>(MUTATION_UPDATE_CONTAINER_VARIABLES);
  const [variables, setVariables] = useState(
    _.mapValues(
      _.mapKeys(container.variables, ({ name }) => name),
      ({ value }) => value,
    ),
  );
  const [newName, setNewName] = useState<string>("");

  const onValueChange = (name: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    setVariables({
      ...variables,
      [name]: evt.target.value,
    });
  };

  const onRemove = (name: string) => () => {
    delete variables[name];
    setVariables(variables);
  };

  const onAdd = () => {
    setVariables(() => {
      setNewName("");
      return {
        ...variables,
        [newName]: "",
      };
    });
  };

  const submit = async () => {
    try {
      await callMutationSafe(updateContainerVariables, {
        containerId: container._id,
        variables: Object.entries(variables)
          .map(([name, value]) => ({ name, value })),
      });
      await onSubmit();
    } catch (err) {
      statusMessages.setErrorMessage(err.message);
    }
  };

  return (
    <Grid container direction="column">
      {statusMessages.render()}
      <Grid item md={6} lg={4}>
        <Table columns={["Name", "Value", ""]}>
          {Object.entries(variables).map(([name, value]) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>
                <TextField
                  onChange={onValueChange(name)}
                  value={value}
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={onRemove(name)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <TextField
                onChange={evt => setNewName(evt.target.value)}
                value={newName}
              />
            </TableCell>
            <TableCell />
            <TableCell>
              <Button variant="outlined" onClick={onAdd}>Add</Button>
            </TableCell>
          </TableRow>
        </Table>
      </Grid>
      <Grid item>
        <Button variant="outlined" onClick={submit}>Save</Button>
      </Grid>
    </Grid>
  );
};
