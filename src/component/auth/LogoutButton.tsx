import React, { useState, useEffect } from "react";
import { MenuItem, Typography } from "@material-ui/core";
import { UserState } from "../auth";

export const LogoutButton: React.FC = () => {
  const [shouldLogout, setShouldLogout] = useState<boolean>(false);

  useEffect(() => {
    if (shouldLogout) {
      UserState.removeAuth();
      window.location.href = "/";
    }
  }, [shouldLogout]);

  return (
    <MenuItem button onClick={() => setShouldLogout(true)}>
      <Typography>Log Out</Typography>
    </MenuItem>
  );
};
