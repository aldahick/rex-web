import React from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { IMutation, IMutationFetchWikiPagesUntilArgs } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";
import { DialogForm } from "../util/DialogForm";

const MUTATION_FETCH_WIKI_PAGES_UNTIL = gql`
  mutation Web_FetchWikiPagesUntil($firstPageName: String!, $untilPageName: String!) {
    progress: fetchWikiPagesUntil(firstPageName: $firstPageName, untilPageName: $untilPageName) {
      _id
    }
  }
`;

interface FetchWikiPagesFormProps {
  onFetch: (progressId: string) => void;
}

export const FetchWikiPagesForm: React.FC<FetchWikiPagesFormProps> = ({ onFetch }) => {
  const [fetchWikiPagesUntil] = useMutation<{ progress: IMutation["fetchWikiPagesUntil"] }, IMutationFetchWikiPagesUntilArgs>(MUTATION_FETCH_WIKI_PAGES_UNTIL);

  const onSubmit = async ({ firstPageName, untilPageName }: {[key: string]: string}) => {
    const { progress } = await callMutationSafe(fetchWikiPagesUntil, { firstPageName, untilPageName });
    onFetch(progress._id);
  };

  return (
    <DialogForm
      title="Fetch Wiki Pages"
      onSubmit={onSubmit}
      fields={{
        firstPageName: {},
        untilPageName: {
          label: "Last Page Name",
        },
      }}
    />
  );
};
