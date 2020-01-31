import React, { useState } from "react";
import {
  Select, MenuItem, FormControl, InputLabel,
} from "@material-ui/core";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { IHost, IQuery } from "../../graphql/types";
import { checkQueryResult } from "../../util/graphql";

const QUERY_HOSTS = gql`
query Web_HostsSelect {
  hosts {
    _id
    name
    hostname
  }
}
`;

interface HostSelectProps {
  onChange: (host: IHost) => void;
}

export const HostSelect: React.FC<HostSelectProps> = ({ onChange }) => {
  const [selected, _setSelected] = useState<string>("");
  const hostsResult = useQuery(QUERY_HOSTS);

  return checkQueryResult<{ hosts: IQuery["hosts"] }>(({ hosts }) => {
    const setSelected = (value: string) => {
      _setSelected(value);
      onChange(hosts.find(h => h._id === value)!);
    };

    return (
      <FormControl fullWidth>
        <InputLabel>Host</InputLabel>
        <Select
          onChange={evt => setSelected(evt.target.value as string)}
          fullWidth
          value={selected}
        >
          {hosts.map(({ _id, name, hostname }) => (
            <MenuItem key={_id} value={_id}>
              {name}
              {" "}
              (
              {hostname}
              )
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  })(hostsResult);
};
