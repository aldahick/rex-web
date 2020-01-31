import React, { useState, Fragment } from "react";
import {
  Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, makeStyles, TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import * as _ from "lodash";
import { Grids } from "./Grids";
import { useStatusMessages } from "../util/statusMessages";

type OnChange = (value: string) => void;

const useStyles = makeStyles({
  addButton: {
    position: "fixed",
    right: "1em",
    bottom: "1em",
  },
});

interface FieldDefinition {
  label?: string;
  render?: (onChange: OnChange) => JSX.Element;
}

interface DialogFormProps<FieldKey extends string> {
  fields: {
    [key in FieldKey]: FieldDefinition
  };
  title: string;
  onSubmit: (fields: {[key in FieldKey]: string}) => Promise<string | undefined | void>;
}

export const DialogForm = <FieldKey extends string>({ fields, title, onSubmit }: DialogFormProps<FieldKey>) => {
  const [open, setOpen] = useState(false);
  const [fieldValues, setFieldValues] = useState<{[key in FieldKey]?: string}>({});

  const statusMessages = useStatusMessages();
  const classes = useStyles();

  const onFieldChange = (fieldKey: FieldKey, value: string) => {
    setFieldValues({
      ...fieldValues,
      [fieldKey]: value,
    });
  };

  const submit = () => {
    const missingFields = (Object.entries(fields) as [FieldKey, FieldDefinition][])
      .filter(([fieldKey]) => !fields[fieldKey]);
    if (missingFields.length > 0) {
      const labels = missingFields.map(([fieldKey, { label }]) => label || _.startCase(fieldKey));
      statusMessages.setErrorMessage(`Missing field values: ${labels.join(", ")}`);
      return;
    }
    onSubmit(fieldValues as {[key in FieldKey]: string})
      .then(successMessage => {
        if (successMessage) {
          statusMessages.setSuccessMessage(successMessage);
        }
        setOpen(false);
      })
      .catch(err => statusMessages.setErrorMessage(err.message));
  };

  return (
    <>
      {statusMessages.render()}
      <Fab color="primary" className={classes.addButton} onClick={() => setOpen(true)}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grids direction="column" spacing={2}>
            {(Object.entries(fields) as [FieldKey, FieldDefinition][])
              .map(([fieldKey, { label, render }], i) => (
                <Fragment key={fieldKey}>
                  {render
                    ? render((value: string) => onFieldChange(fieldKey, value))
                    : (
                      <TextField
                        label={label || _.startCase(fieldKey)}
                        autoFocus={i === 0}
                        fullWidth
                        onChange={evt => onFieldChange(fieldKey, evt.target.value)}
                      />
                    )}
                </Fragment>
              ))}
          </Grids>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={submit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// export function DialogForm<K>() {
//   const [fields, setFields] = useState<{[key: string]: string}>({});
// }
