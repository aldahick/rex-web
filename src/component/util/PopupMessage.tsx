import { Snackbar, SnackbarProps } from "@material-ui/core";
import { Alert, AlertProps } from "@material-ui/lab";
import React, { useEffect, useState } from "react";

interface PopupMessageProps {
  text?: string;
  duration?: number | null;
  severity: AlertProps["severity"];
  anchor?: SnackbarProps["anchorOrigin"];
}

export const PopupMessage: React.FC<PopupMessageProps> = ({
  text, duration, severity, anchor = { vertical: "top", horizontal: "center" },
}) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(text !== undefined);
  }, [text]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration === null ? null : (duration ?? 5000)}
      onClose={() => setOpen(false)}
      anchorOrigin={anchor}
    >
      <Alert severity={severity} onClick={() => setOpen(false)}>
        {text}
      </Alert>
    </Snackbar>
  );
};
