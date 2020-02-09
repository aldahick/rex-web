import { Typography } from "@material-ui/core";
import * as _ from "lodash";
import React from "react";
import { MutationFunction, QueryComponentOptions, QueryResult } from "react-apollo";
import { PopupMessage } from "../component/PopupMessage";
import { AggregateError } from "./AggregateError";

// Apollo's default conventions are complex & verbose
// These helpers standardize our handling of the possible return values Apollo could throw us

export const callMutationSafe = async <Data, Variables>(
  mutation: MutationFunction<Data, Variables>,
  variables: Variables,
): Promise<Data> => {
  const res = await mutation({ variables });
  if (!res) {
    throw new Error("no response");
  } else if (res.errors) {
    // eslint-disable-next-line no-console
    console.error(res.errors);
    throw new AggregateError(res.errors);
  } else if (!res.data) {
    throw new Error("no data");
  }
  return res.data;
};

// Trailing comma is necessary because Typescript thinks <Data> is a JSX tag otherwise
export const checkQueryResult = <Data, >(
  callback: (data: Data, result: QueryResult<Data>) => JSX.Element | null,
  loadingCallback?: () => JSX.Element | null,
): QueryComponentOptions["children"] => (result: QueryResult<Data>) => {
    const { loading, data, error } = result;
    if (loading) {
      return loadingCallback ? loadingCallback() : <Typography style={{ textAlign: "center" }}>Loading...</Typography>;
    }
    if (error || !data) {
      return (
        <PopupMessage
          severity="error"
          text={error?.message || "No data available."}
        />
      );
    }
    return callback(data, result);
  };

export const removeTypename = <T extends { __typename?: string }>(value: T): Omit<T, "__typename"> => {
  const newValue = _.cloneDeep(value);
  delete newValue.__typename;
  return newValue;
};
