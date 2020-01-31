import React, { useState } from "react";
import { PopupMessage } from "../component/PopupMessage";

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
