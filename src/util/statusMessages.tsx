import React, { useState } from "react";
import { PopupMessage } from "../component/util/PopupMessage";

export interface StatusMessages {
  errorMessage: string;
  setErrorMessage: (text: string) => void;

  successMessage: string;
  setSuccessMessage: (text: string) => void;

  render: () => JSX.Element;
}

export type StatusMessagesMethods = Pick<StatusMessages, "setErrorMessage" | "setSuccessMessage">;

export const useStatusMessages = () => {
  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  return {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    render: () => (
      <>
        <PopupMessage text={successMessage} severity="success" />
        <PopupMessage text={errorMessage} severity="error" />
      </>
    ),
  };
};
