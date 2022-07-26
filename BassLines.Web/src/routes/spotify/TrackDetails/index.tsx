import * as React from "react";
import { SpotifyApi, SpotifyTrackDetails, UserModel } from "../../../data/src";
import { useSpotify } from "../../../contexts/spotifyContext";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

interface ITrackDetailsProps {
  trackId: string;
}

export default function TrackDetails({ trackId }: ITrackDetailsProps) {
  const {
    callSpotify,
    state: { authorized },
  } = useSpotify();
  const [trackDetails, setTrackDetails] = React.useState<SpotifyTrackDetails>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!authorized) return undefined;
      setLoading(true);
      try {
        const track = await callSpotify(SpotifyApi).apiSpotifyTrackIdDetailsGet({
          id: trackId,
        });
        setTrackDetails(track);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [trackId, authorized]);

  return loading ? (
    <>Loading...</>
  ) : (
    <Container sx={{ backgroundColor: "#bada55", width: "100%" }} maxWidth="xl">
      <Box
        component="img"
        src={trackDetails?.artistDetails?.images?.[1]?.url}
      />
    </Container>
  );
}
