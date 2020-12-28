import { useQuery } from "@apollo/client";
import { Grid } from "@material-ui/core";
import gql from "graphql-tag";
import * as _ from "lodash";
import React, { useState } from "react";

import { MediaContentView } from "../component/media/MediaContentView";
import { MediaNavMenu } from "../component/media/MediaNavMenu";
import { MediaSeries } from "../component/media/MediaSeries";
import {
  IMediaItem, IMediaItemType,
  IQuery, IQueryMediaItemsArgs,
} from "../graphql/types";
import { checkQueryResult } from "../util/graphql";

const QUERY_MEDIA_ITEMS = gql`
query Web_MediaItems($dir: String!) {
  mediaItems(dir: $dir) {
    key
    type
  }
}
`;

export const MediaScene: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<IMediaItem[]>([]);
  const lastSelected = selectedItems.slice(-1)[0] as IMediaItem | undefined;
  const selectedType = lastSelected?.type ?? IMediaItemType.Directory;
  const selectedKey = () => selectedItems.map(i => i.key).join("/");

  return checkQueryResult<{ mediaItems: IQuery["mediaItems"] }>(({ mediaItems }) => (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <MediaNavMenu
          selected={selectedItems}
          options={mediaItems}
          onSelect={item => setSelectedItems([...selectedItems, item])}
          onReset={items => setSelectedItems(items)}
        />
      </Grid>
      {selectedType === IMediaItemType.File && (
        <Grid item>
          <MediaContentView selectedKey={selectedKey()} />
        </Grid>
      )}
      {selectedType === IMediaItemType.Series && (
        <Grid item>
          <MediaSeries
            selectedKey={selectedKey()}
            items={_.sortBy(mediaItems, ({ key }) => Number(key.split(".")[0]))}
          />
        </Grid>
      )}
    </Grid>
  ))(useQuery<{ mediaItems: IQuery["mediaItems"] }, IQueryMediaItemsArgs>(QUERY_MEDIA_ITEMS, {
    variables: {
      dir: selectedItems.filter(i => i.type !== IMediaItemType.File).map(i => i.key).join("/"),
    },
  }));
};
