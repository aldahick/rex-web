import React, { useState } from "react";
import * as _ from "lodash";
import {
  DragDropContext, DragUpdate, DropResult, ResponderProvided,
} from "react-beautiful-dnd";
import { useRouteMatch } from "react-router";
import { RummikubCards } from "../../component/rummikub/RummikubCards";
import { IRummikubCard, IRummikubCardColor } from "../../graphql/types";
import { useStores } from "../../hook/useStores";

export const RummikubGameScene: React.FC = () => {
  const { socketStore } = useStores();
  const { params: { gameId } } = useRouteMatch<{ gameId: string }>();

  const [allCards, setAllCards] = useState({
    first: Object.values(IRummikubCardColor).map<IRummikubCard>(color => ({ color, value: 14 })),
    second: Object.values(IRummikubCardColor).map<IRummikubCard>(color => ({ color, value: undefined })),
  });
  const onDragEnd = ({ destination, source, draggableId }: DropResult) => {
    if (!destination) {
      return;
    }
    const from = source.droppableId as keyof typeof allCards;
    const to = destination.droppableId as keyof typeof allCards;
    const cards = _.cloneDeep(allCards);
    const [card] = cards[from].splice(source.index, 1);
    cards[to].splice(destination.index, 0, card);
    setAllCards(cards);
  };
  // const onDragUpdate = ({ destination, source }: DragUpdate) => {
  //   if (!destination) {
  //     return;
  //   }
  //   const from = source.droppableId as keyof typeof allCards;
  //   const to = destination.droppableId as keyof typeof allCards;
  //   // const [card] = allCards[from].splice(source.index, 1);
  //   // allCards[to].splice(destination.index, 0, card);
  //   // setAllCards(allCards);
  // };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {Object.entries(allCards).map(([key, cards]) => (
        <RummikubCards key={key} dropId={key} cards={cards} />
      ))}
    </DragDropContext>
  );
};
