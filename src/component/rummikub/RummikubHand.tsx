import React from "react";
import { observer } from "mobx-react";
import { IRummikubServerHandPayload } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { SocketEvent } from "../socket/SocketEvent";
import { RummikubCards } from "./RummikubCards";

export const RummikubHand: React.FC = observer(() => {
  const { rummikubStore } = useStores();

  const onHandData = (data: IRummikubServerHandPayload) => {
    rummikubStore.setHand(data.hand);
  };

  return (
    <SocketEvent name="rummikub.server.hand" handle={onHandData}>
      <RummikubCards dropId="hand" cards={rummikubStore.hand} />
    </SocketEvent>
  );
});
