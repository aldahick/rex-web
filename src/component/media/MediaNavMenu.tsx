import React, { useEffect, useState } from "react";
import {
  Breadcrumbs, Button, Link, makeStyles,
  MenuItem, Select, Typography,
} from "@material-ui/core";
import * as _ from "lodash";
import { IMediaItem, IMediaItemType } from "../../graphql/types";

const useStyles = makeStyles({
  breadcrumbLink: {
    cursor: "pointer",
  },
});

interface MediaNavMenuProps {
  selected: IMediaItem[];
  options: IMediaItem[];
  onSelect(item: IMediaItem): void;
  onReset(selected: IMediaItem[]): void;
}

export const MediaNavMenu: React.FC<MediaNavMenuProps> = ({
  onSelect, onReset, selected, options,
}) => {
  const [current, setCurrent] = useState<IMediaItem>();
  const classes = useStyles();

  useEffect(() => {
    setCurrent(options[0]);
  }, [options]);

  return (
    <>
      <Breadcrumbs>
        {selected.map((item, i) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link className={classes.breadcrumbLink} key={item.key} onClick={() => onReset(selected.slice(0, i))}>
            <Typography>{item.key}</Typography>
          </Link>
        ))}
      </Breadcrumbs>
      {(selected.slice(-1)[0]?.type || IMediaItemType.Directory) === IMediaItemType.Directory && (
        <>
          <Select
            value={current?.key || options[0].key}
            onChange={evt => setCurrent(options.find(i => i.key === evt.target.value))}
          >
            {_.sortBy(options, i => i.key).map(item => (
              <MenuItem value={item.key} key={item.key}>
                <Typography>{item.key}</Typography>
              </MenuItem>
            ))}
          </Select>
          <Button onClick={() => onSelect(current || options[0])}>
            List
          </Button>
        </>
      )}
    </>
  );
};
