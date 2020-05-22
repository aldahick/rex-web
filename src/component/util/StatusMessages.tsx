import React from "react";
import { observer } from "mobx-react";
import { useStores } from "../../hook/useStores";
import { PopupMessage } from "./PopupMessage";

export const StatusMessages: React.FC = observer(() => {
  const { statusStore } = useStores();

  return (
    <>
      <PopupMessage text={statusStore.successMessage} severity="success" />
      <PopupMessage text={statusStore.errorMessage} severity="error" />
    </>
  );
});
