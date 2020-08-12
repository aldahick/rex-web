import React, { Fragment, useState } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
} from "@material-ui/core";
import * as _ from "lodash";
import { useStores } from "../../hook/useStores";
import { AddButton } from "./AddButton";
import { Grids } from "./Grids";

type OnChange = (value: string) => void;

interface FieldDefinition {
  initialValue?: string;
  label?: string;
  render?: (value: string | undefined, onChange: OnChange) => JSX.Element;
}

interface DialogFormProps<FieldKey extends string> {
  fields: {
    [key in FieldKey]: FieldDefinition
  };
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onSubmit: (fields: {[key in FieldKey]: string}) => Promise<string | undefined | void>;
}

export const DialogForm = <FieldKey extends string>({ fields, title, onSubmit }: DialogFormProps<FieldKey>): React.ReactElement => {
  const { statusStore } = useStores();
  const [open, setOpen] = useState(false);

  const initialFieldValues = Object.fromEntries<string>(
    Object.entries<FieldDefinition>(fields)
      .map(([key, { initialValue }]) => [key, initialValue ?? ""]),
  ) as unknown as {[key in FieldKey]: string};
  const [fieldValues, setFieldValues] = useState<{[key in FieldKey]: string}>(initialFieldValues);

  const onFieldChange = (fieldKey: FieldKey, value: string) => {
    setFieldValues({
      ...fieldValues,
      [fieldKey]: value,
    });
  };

  const submit = () => {
    const missingFields = (Object.entries(fields) as [FieldKey, FieldDefinition][])
      .filter(([fieldKey]) => fieldValues[fieldKey].length === 0);
    if (missingFields.length > 0) {
      const labels = missingFields.map(([fieldKey, { label }]) => label ?? _.startCase(fieldKey));
      statusStore.setErrorMessage(`Missing field values: ${labels.join(", ")}`);
      return;
    }
    onSubmit(fieldValues as {[key in FieldKey]: string})
      .then(successMessage => {
        if (successMessage !== undefined) {
          statusStore.setSuccessMessage(successMessage);
        }
        setOpen(false);
      })
      .catch(err => statusStore.setErrorMessage(err instanceof Error ? err.message : err));
  };

  const checkEnterKey = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key.toLowerCase() === "enter") {
      submit();
    }
  };

  return (
    <>
      <AddButton onClick={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <Grids direction="column" spacing={2}>
            {(Object.entries(fields) as [FieldKey, FieldDefinition][])
              .map(([fieldKey, { label, render }], i) => (
                <Fragment key={fieldKey}>
                  {render
                    ? render(fieldValues[fieldKey], (value: string) => onFieldChange(fieldKey, value))
                    : (
                      <TextField
                        label={label ?? _.startCase(fieldKey)}
                        autoFocus={i === 0}
                        fullWidth
                        onChange={evt => onFieldChange(fieldKey, evt.target.value)}
                        onKeyDown={checkEnterKey}
                      />
                    )}
                </Fragment>
              ))}
          </Grids>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={submit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
