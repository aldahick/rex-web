import React, { useState, useEffect } from "react";
import { Snackbar, SnackbarProps } from "@material-ui/core";
import { Alert, AlertProps } from "@material-ui/lab";

interface PopupMessageProps {
  text?: string;
  duration?: number | null;
  severity: AlertProps["severity"];
  anchor?: SnackbarProps["anchorOrigin"];
}

export const PopupMessage: React.FC<PopupMessageProps> = ({
  text, duration, severity, anchor,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(!!text);
  }, [text]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration === null ? null : (duration || 5000)}
      onClose={() => setOpen(false)}
      anchorOrigin={anchor || { vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} onClick={() => setOpen(false)}>
        {text}
      </Alert>
    </Snackbar>
  );
};
