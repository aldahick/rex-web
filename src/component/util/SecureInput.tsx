import React, { useState } from "react";
import { IconButton, TextField } from "@material-ui/core";
import VisibleIcon from "@material-ui/icons/Visibility";
import InvisibleIcon from "@material-ui/icons/VisibilityOff";
import { Grids } from "./Grids";

export const SecureInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ children, onChange, value }) => {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <Grids alignItems="center">
      <TextField
        onChange={evt => onChange(evt.target.value)}
        value={isHidden ? "******" : value}
        disabled={isHidden}
      />
      <IconButton onClick={() => setIsHidden(!isHidden)}>
        {isHidden ? <VisibleIcon /> : <InvisibleIcon />}
      </IconButton>
      {children}
    </Grids>
  );
};
