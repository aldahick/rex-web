import React from "react";
import {
  Card, CardActions, CardContent, CardHeader, Grid, IconButton,
  Typography,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { Link } from "react-router-dom";
import { AddRummikubGameForm } from "../../component/rummikub/AddRummikubGameForm";
import { IQuery } from "../../graphql/types";
import { checkQueryResult } from "../../util/graphql";

const QUERY_RUMMIKUB_GAMES = gql`
query Web_RummikubGames {
  games: rummikubGames {
    _id
    name
    playerNames
  }
}
`;

export const RummikubGamesScene: React.FC = () => checkQueryResult<{ games: IQuery["rummikubGames"] }>(({ games }, { refetch }) => (
  <Grid container>
    {games.map(game => (
      <Grid key={game._id} item xs={4} sm={3} md={2}>
        <Card>
          <CardHeader title={game.name} />
          <CardContent>
            <Typography variant="body1">
              {game.playerNames.length}
              {" "}
              players
            </Typography>
            {game.playerNames.map(playerName => (
              <Typography key={playerName} variant="body2">{playerName}</Typography>
            ))}
          </CardContent>
          <CardActions>
            <Link to={`/rummikub/game/${game._id}`}>
              <IconButton>
                <PersonAddIcon />
              </IconButton>
            </Link>
          </CardActions>
        </Card>
      </Grid>
    ))}
    <AddRummikubGameForm onSubmit={refetch} />
  </Grid>
))(useQuery(QUERY_RUMMIKUB_GAMES));
