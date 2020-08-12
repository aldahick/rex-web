import React from "react";
import { Fab, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles({
  addButton: {
    position: "fixed",
    right: "1em",
    bottom: "1em",
  },
});

export const AddButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  const classes = useStyles();

  return (
    <Fab color="primary" className={classes.addButton} onClick={onClick}>
      <AddIcon />
    </Fab>
  );
};
