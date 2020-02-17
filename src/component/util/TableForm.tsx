import * as _ from "lodash";
import React, { useState } from "react";
import {
  TableRow, TableCell, Button, TextField, IconButton, Grid,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useStatusMessages } from "../../util/statusMessages";
import { Table } from "./Table";

interface TableFormColumn {
  isOptional?: boolean;
  label?: string;
}

interface TableFormProps<Key extends string> {
  columns: {
    [key in Key]: TableFormColumn;
  };
  rows: {[key in Key]: string}[];
  onSubmit: (newRows: {[key in Key]: string}[]) => Promise<any>;
}

export const TableForm = <Key extends string>({ columns, rows: originalRows, onSubmit }: TableFormProps<Key>) => {
  const keys = Object.keys(columns) as Key[];

  const statusMessages = useStatusMessages();
  const [rows, setRows] = useState<{[key in Key]: string}[]>(originalRows);
  const [newRow, setNewRow] = useState<{[key in Key]?: string}>({});

  const onValueChange = (index: number, key: Key) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    const clonedRows = _.cloneDeep(rows);
    clonedRows[index][key] = evt.target.value;
    setRows(clonedRows);
  };

  const onNewValueChange = (key: Key) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    setNewRow({
      ...newRow,
      [key]: evt.target.value,
    });
  };

  const onRemove = (index: number) => () => {
    setRows(rows.filter((r, i) => i !== index));
  };

  const onAdd = () => {
    setRows(() => {
      const missingColumns = Object.entries<TableFormColumn>(columns)
        .filter(([key, { isOptional }]) => !isOptional && !newRow[key as Key]);
      if (missingColumns.length > 0) {
        statusMessages.setErrorMessage(`Missing required fields: ${
          missingColumns.map(([key]) => key).join(", ")
        }`);
        return rows;
      }
      setNewRow({});
      return rows.concat(newRow as {[key in Key]: string});
    });
  };

  const submit = async () => {
    try {
      const successMessage = await onSubmit(rows);
      if (typeof (successMessage) === "string" && !!successMessage) {
        statusMessages.setSuccessMessage(successMessage);
      }
    } catch (err) {
      statusMessages.setErrorMessage(err.message);
    }
  };

  return (
    <Grid container direction="column">
      {statusMessages.render()}
      <Grid item>
        <Table columns={(keys as string[]).concat([""]).map(_.startCase)}>
          {rows.map((row, index) => (
            <TableRow key={JSON.stringify(row)}>
              {keys.map(key => (
                <TableCell key={key}>
                  <TextField
                    onChange={onValueChange(index, key)}
                    value={row[key]}
                    placeholder={_.startCase(key)}
                  />
                </TableCell>
              ))}
              <TableCell>
                <IconButton onClick={onRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            {keys.map(key => (
              <TableCell key={key}>
                <TextField
                  onChange={onNewValueChange(key)}
                  value={newRow[key] || ""}
                  placeholder={_.startCase(key)}
                />
              </TableCell>
            ))}
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
