import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { checkQueryResult } from "../util/graphql";
import {
  IQuery, IQueryMediaItemsArgs, IMediaItem, IMediaItemType,
} from "../graphql/types";
import { MediaNavMenu } from "../component/media/MediaNavMenu";
import { Grids } from "../component/util/Grids";
import { MediaContentView } from "../component/media/MediaContentView";
import { MediaSeries } from "../component/media/MediaSeries";

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
  const selectedType = (selectedItems.slice(-1)[0])?.type || IMediaItemType.Directory;
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
        <MediaSeries selectedKey={selectedKey()} items={mediaItems} />
      )}
    </Grids>
  ))(useQuery<any, IQueryMediaItemsArgs>(QUERY_MEDIA_ITEMS, {
    variables: {
      dir: selectedItems.filter(i => i.type !== IMediaItemType.File).map(i => i.key).join("/"),
    },
  }));
};
