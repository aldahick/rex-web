import { useQuery } from "@apollo/client";
import {
  FormControl, InputLabel,
  MenuItem, Select,
} from "@material-ui/core";
import gql from "graphql-tag";
import React, { useState } from "react";

import { IHost, IQuery } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
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
  const [selected, setSelected] = useState<string>("");
  const hostsResult = useQuery(QUERY_HOSTS);
  const { statusStore } = useStores();

  return checkQueryResult<{ hosts: IQuery["hosts"] }>(({ hosts }) => {
    const onSelectChange = (value: string) => {
      setSelected(value);
      const host = hosts.find(h => h._id === value);
      if (!host) {
        statusStore.setErrorMessage(`Couldn't find host id=${value}`);
        return;
      }
      onChange(host);
    };

    return (
      <FormControl fullWidth>
        <InputLabel>
          Host
        </InputLabel>
        <Select
          onChange={evt => onSelectChange(evt.target.value as string)}
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
