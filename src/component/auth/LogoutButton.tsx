import { ListItem, ListItemText } from "@material-ui/core";
import React, { useEffect, useState } from "react";

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
    <ListItem button onClick={() => setShouldLogout(true)}>
      <ListItemText primary="Log Out" />
    </ListItem>
  );
};
