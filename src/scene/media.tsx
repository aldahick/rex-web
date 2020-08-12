import React, { useState } from "react";
import gql from "graphql-tag";
import * as _ from "lodash";
import { useQuery } from "react-apollo";
import { MediaContentView } from "../component/media/MediaContentView";
import { MediaNavMenu } from "../component/media/MediaNavMenu";
import { MediaSeries } from "../component/media/MediaSeries";
import { Grids } from "../component/util/Grids";
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
    <Grids direction="column" alignItems="center">
      <MediaNavMenu
        selected={selectedItems}
        options={mediaItems}
        onSelect={item => setSelectedItems([...selectedItems, item])}
        onReset={items => setSelectedItems(items)}
      />
      {selectedType === IMediaItemType.File && (
        <MediaContentView selectedKey={selectedKey()} />
      )}
      {selectedType === IMediaItemType.Series && (
        <MediaSeries
          selectedKey={selectedKey()}
          items={_.sortBy(mediaItems, ({ key }) => Number(key.split(".")[0]))}
        />
      )}
    </Grids>
  ))(useQuery<{ mediaItems: IQuery["mediaItems"] }, IQueryMediaItemsArgs>(QUERY_MEDIA_ITEMS, {
    variables: {
      dir: selectedItems.filter(i => i.type !== IMediaItemType.File).map(i => i.key).join("/"),
    },
  }));
};
