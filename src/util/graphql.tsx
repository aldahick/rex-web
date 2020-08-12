import React from "react";
import { CircularProgress } from "@material-ui/core";
import * as _ from "lodash";
import { MutationFunction, QueryComponentOptions, QueryResult } from "react-apollo";
import { PopupMessage } from "../component/util/PopupMessage";
import { AggregateError } from "./AggregateError";

// Apollo's default conventions are complex & verbose
// These helpers standardize our handling of the possible return values Apollo could throw us

export const callMutationSafe = async <Data, Variables>(
  mutation: MutationFunction<Data, Variables>,
  variables: Variables,
): Promise<Data> => {
  const res = await mutation({ variables });
  if (res.errors) {
    // eslint-disable-next-line no-console
    console.error(res.errors);
    throw new AggregateError(res.errors);
  } else if (!res.data) {
    throw new Error("no data");
  }
  return res.data;
};

export const checkQueryResult = <Data, Variables = unknown>(
  callback: (data: Data, result: QueryResult<Data, Variables>) => JSX.Element | null,
  loadingCallback?: () => JSX.Element | null,
): QueryComponentOptions<Data, Variables>["children"] => (result: QueryResult<Data, Variables>) => {
  const { loading, data, error } = result;
  if (loading) {
    return loadingCallback ? loadingCallback() : <CircularProgress />;
  }
  if (error || !data) {
    return (
      <PopupMessage
        severity="error"
        text={error?.message ?? "No data available."}
      />
    );
  }
  return callback(data, result);
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const removeTypename = <T extends { __typename?: string }>(value: T): Omit<T, "__typename"> => {
  const newValue = _.cloneDeep(value);
  delete newValue.__typename;
  return newValue;
};
