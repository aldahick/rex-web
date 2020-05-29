import React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { IRummikubCard } from "../../graphql/types";
import { RummikubCard } from "./RummikubCard";

const useStyles = makeStyles({
  container: {
    display: "inline-flex",
    border: "1px black solid",
  },
});

export const RummikubCards: React.FC<{
  cards: IRummikubCard[];
  dropId: string;
}> = ({ cards, dropId }) => {
  const classes = useStyles();

  return (
    <Droppable droppableId={dropId}>
      {provided => (
        <Grid container spacing={3} ref={provided.innerRef} {...provided.droppableProps}>
          {cards.map((card, index) => (
            <Draggable
              draggableId={`${card.color}-${card.value}`}
              key={`${card.color}-${card.value}`}
              index={index}
            >
              {({ dragHandleProps, draggableProps, innerRef }) => (
                <Grid item ref={innerRef} {...dragHandleProps} {...draggableProps}>
                  <RummikubCard {...card} />
                </Grid>
              )}
            </Draggable>
          ))}
          <Grid item>
            {provided.placeholder}
          </Grid>
        </Grid>
      )}
    </Droppable>
  );
};
