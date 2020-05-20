import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import axios from "axios";

interface FetchUrlProps {
  children: (data: string) => JSX.Element;
  url: string;
}

export const FetchUrl: React.FC<FetchUrlProps> = ({ children, url }) => {
  const [data, setData] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  if (errorMessage) {
    return <Typography color="error">{errorMessage}</Typography>;
  }
  if (!data) {
    console.log("loading...");
    axios.get(url)
      .then(r => setData(r.data))
      .catch(err => setErrorMessage(err.message));
    return <Typography>Loading...</Typography>;
  }
  return children(data);
};
