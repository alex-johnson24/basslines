import * as React from "react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  CircularProgress,
  Container,
  Fab,
  Icon,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation } from "react-query";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import {
  SpotifyEntityType,
  useSpotify,
} from "../../../contexts/spotifyContext";
import {
  SpotifyAlbum,
  SpotifyApi,
  SpotifyArtistDetails,
  SpotifyTrackDetails,
} from "../../../data/src";

const SpotifyNavigator = () => {
  const {
    state: { navigatorTarget, authorized },
    callSpotify,
  } = useSpotify();
  const [currentTrack, setCurrentTrack] = React.useState<SpotifyTrackDetails>();
  useStyles()

  React.useEffect(() => {
    authorized &&
      navigatorTarget?.id &&
      callSpotify(SpotifyApi)
        .trackIdDetailsGet({ id: navigatorTarget?.id })
        .then(setCurrentTrack)
        .catch(console.log);

    // TODO: handle albums and artists
  }, [navigatorTarget, authorized]);

  React.useEffect(() => console.log(currentTrack), [currentTrack]);

  return <>Hello from the navigator! 👨‍✈️👨‍✈️👨‍✈️</>;
};

export default SpotifyNavigator;

const useStyles = makeStyles(console.log);
