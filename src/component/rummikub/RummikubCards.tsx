import { Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

import { IRummikubCard } from "../../graphql/types";
import { RummikubCard } from "./RummikubCard";

const useStyles = makeStyles({
  root: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  cardContainer: {
    display: "inline-block",
  },
  placeholder: {
    border: "1px gray dotted",
  },
  placeholderText: {
    padding: "1em",
  },
});

export const RummikubCards: React.FC<{
  cards: IRummikubCard[];
  dropId: string;
  placeholder?: boolean;
}> = ({ cards, dropId, placeholder = false }) => {
  const classes = useStyles();

  return (
    <Droppable droppableId={dropId} direction="horizontal">
      {provided => (
        <Grid
          className={[classes.root, placeholder ? classes.placeholder : ""].join(" ")}
          container
          spacing={1}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {placeholder ? (
            <Typography
              variant="h6"
              className={classes.placeholderText}
            >
              Drop here for new row
            </Typography>
          ) : cards.map((card, index) => (
            <Draggable
              draggableId={`${card.color}-${card.value ?? "joker"}`}
              key={`${card.color}-${card.value ?? "joker"}`}
              index={index}
            >
              {({ dragHandleProps, draggableProps, innerRef }) => (
                <Grid
                  className={classes.cardContainer}
                  item
                  ref={innerRef}
                  {...dragHandleProps}
                  {...draggableProps}
                >
                  <RummikubCard {...card} />
                </Grid>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Grid>
      )}
    </Droppable>
  );
};
