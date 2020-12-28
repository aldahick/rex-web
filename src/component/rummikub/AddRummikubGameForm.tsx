import { useMutation } from "@apollo/client";
import { MenuItem, Select } from "@material-ui/core";
import gql from "graphql-tag";
import React from "react";

import { IMutationCreateRummikubGameArgs, IRummikubGamePrivacy } from "../../graphql/types";
import { callMutationSafe } from "../../util/graphql";
import { DialogForm } from "../util/DialogForm";

const MUTATION_CREATE_RUMMIKUB_GAME = gql`
mutation Web_CreateRummikubGame($name: String!, $privacy: RummikubGamePrivacy!) {
  game: createRummikubGame(name: $name, privacy: $privacy) {
    _id
  }
}
`;

export const AddRummikubGameForm: React.FC<{
  onSubmit: () => Promise<unknown>;
}> = ({ onSubmit }) => {
  const [createRummikubGame] = useMutation<unknown, IMutationCreateRummikubGameArgs>(MUTATION_CREATE_RUMMIKUB_GAME);
  return (
    <DialogForm
      title="Create Game"
      onSubmit={async ({ name, privacy }) => {
        await callMutationSafe(createRummikubGame, {
          name,
          privacy: privacy as IRummikubGamePrivacy,
        });
        await onSubmit();
      }}
      fields={{
        name: {},
        privacy: {
          initialValue: Object.values(IRummikubGamePrivacy)[0],
          render: (value, onChange) => (
            <Select
              label="Privacy"
              value={value}
              onChange={evt => onChange(evt.target.value as string)}
            >
              {Object.entries(IRummikubGamePrivacy).map(([label, privacy]) => (
                <MenuItem value={privacy} key={privacy}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          ),
        },
      }}
    />
  );
};
