import * as React from "react";
import { makeStyles } from "@mui/styles";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LabelList,
} from "recharts";
import { call } from "../../data/callWrapper";
import {
  ArtistDetails,
  SpotifyApi,
  SpotifyLinkReference,
  UserMetricsModel,
  UserModel,
  UsersApi,
} from "../../data/src";
import { useUserState } from "../../contexts";
import { useSpotify } from "../../contexts/spotifyContext";
import { format } from "date-fns";
import { getListOfSpotifyUris, parseSpotifyId } from "../../utils";
import SpotifyLogo from "../spotify/spotifyLogo";
import { PlayArrowRounded } from "@material-ui/icons";

const useStyles = makeStyles(() => {
  return {
    centeredText: {
      textAlign: "center",
    },
    chartBox: {
      margin: "20px 0 !important",
    },
  };
});

const renderTooltip = ({ active, payload, label }) => {
  return (
    payload?.length > 0 && (
      <Paper sx={{ padding: "10px" }}>
        <Typography
          variant="h6"
          color="secondary"
        >{`${payload[0].payload.rating}/10`}</Typography>
        <Typography variant="subtitle1">{payload[0].payload.title}</Typography>
        <Typography variant="caption">{payload[0].payload.artist}</Typography>
      </Paper>
    )
  );
};

const renderPieTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  return (
    payload?.length > 0 && (
      <Paper sx={{ padding: "10px", pointerEvents: "none" }}>
        <Typography
          variant="h6"
          color={theme.palette.text.primary}
        >{`${payload[0].payload.artist}:`}</Typography>{" "}
        <span>
          <Typography color="secondary" variant="h6">
            {payload[0].payload.count}
          </Typography>
        </span>
      </Paper>
    )
  );
};

const MyCharts = () => {
  const classes = useStyles();

  const theme = useTheme();

  const { userInfo } = useUserState();
  const {
    state: { profile, authorized },
    callSpotify,
  } = useSpotify();

  const [artistDetailsPool, setArtistDetailsPool] = React.useState<
    ArtistDetails[]
  >([]);
  const [artistImgUrl, setArtistImgUrl] = React.useState("");
  const [userMetrics, setUserMetrics] = React.useState<UserMetricsModel>();
  const [selectedUser, setSelectedUser] = React.useState<string>("");
  const [users, setUsers] = React.useState<UserModel[]>([]);

  React.useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await call(UsersApi).apiUsersStudioUsersGet();
        setUsers(users);
      } catch (e) {}
    };
    getUsers();
  }, []);

  React.useEffect(() => {
    if (selectedUser) {
      const getUserMetrics = async (userId: string) => {
        try {
          let userData = await call(UsersApi).apiUsersUserMetricsGet({
            userId,
          });
          setUserMetrics(userData);
        } catch (e) {}
      };
      getUserMetrics(selectedUser);
    }
  }, [selectedUser]);

  React.useEffect(() => {
    if (userInfo.id) {
      setSelectedUser(userInfo.id);
    }
  }, [userInfo]);

  const handleHover = (artist: string) => {
    const images = artistDetailsPool
      ?.find(({ name }) => name?.toLowerCase() == artist?.toLowerCase())
      ?.images?.sort((a, b) => a?.height - b?.height);

    if (!images) return undefined;

    setArtistImgUrl((images[1] ?? images[0])?.url);
  };

  const uris = getListOfSpotifyUris(
    userMetrics?.spotifySongs.map(({ link }) => link)
  );

  const handleSpotifyArtistGet = async () => {
    if (!authorized || !userMetrics?.topArtists) return undefined;

    const artists = await callSpotify(SpotifyApi).artistsFromTrackIdsPost({
      requestBody: userMetrics.topArtists
        .map(({ trackRefLink }) => parseSpotifyId(trackRefLink)[0])
        .filter(Boolean),
    });

    setArtistDetailsPool((c) => [
      ...c,
      ...artists.filter((a) => -1 === c.findIndex(({ id }) => id === a.id)),
    ]);
  };

  const handleSongChartClickPlay = (e) => {
    const link = e?.activePayload?.[0]?.payload?.link;

    if (!link) return undefined;
    const [id, isValid] = parseSpotifyId(link);

    if (isValid && profile?.premium) {
      callSpotify(SpotifyApi)
        .playPut({
          playContextRequest: {
            uris: [`spotify:track:${id}`],
            positionMs: 0,
          },
        })
        .catch(console.warn);
    }
  };

  const handleGenreChartClickPlay = (e) => {
    try {
      const links = e?.activePayload?.[0]?.payload?.spotifyLinks;
      if (!links?.length) throw undefined;

      const uris = getListOfSpotifyUris(links);
      if (!uris?.length || !profile?.premium) throw undefined;

      callSpotify(SpotifyApi).playPut({
        playContextRequest: {
          uris,
          positionMs: 0,
        },
      });
    } catch (e) {
      return undefined;
    }
  };

  const handleArtistClickPlay = (artistUri?: string) => {
    if (!artistUri) return void 0;

    callSpotify(SpotifyApi)
      .playPut({
        playContextRequest: {
          contextUri: artistUri,
          positionMs: 0,
        },
      })
      .catch(console.warn);
  };

  return (
    <>
      <FormControl>
        <InputLabel id="userSelect">User</InputLabel>
        <Select
          labelId="userSelect"
          value={selectedUser}
          label="User"
          onChange={(e) => setSelectedUser(e.target.value as string)}
          variant="outlined"
        >
          {users.map((m, i) => (
            <MenuItem
              key={i}
              value={m.id}
            >{`${m.firstName} ${m.lastName}`}</MenuItem>
          ))}
        </Select>
        {profile?.premium && (
          <Button
            variant="contained"
            disabled={!uris.length}
            sx={{ color: "#50d292" }}
            onClick={async () => {
              callSpotify(SpotifyApi)
                .playPut({
                  playContextRequest: {
                    uris,
                    positionMs: 0,
                  },
                })
                .catch((ex) => {});
            }}
          >
            <PlayArrowRounded fontSize="small" /> Play{" "}
            {users?.find((u) => u.id === selectedUser)?.firstName}'s BassLines
            <SpotifyLogo
              fill={"#50d292"}
              style={{ height: 18, marginLeft: 8 }}
            />
          </Button>
        )}
      </FormControl>
      <Container maxWidth="xl">
        <Grid container>
          <Grid item xs={6} md={3}>
            <Typography className={classes.centeredText} variant="h3">
              {userMetrics?.averageRating || "--"}
            </Typography>
            <Typography className={classes.centeredText} variant="subtitle1">
              Average
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography className={classes.centeredText} variant="h3">
              {userMetrics?.songSubmissionCount || "--"}
            </Typography>
            <Typography className={classes.centeredText} variant="subtitle1">
              Song Submissions
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography className={classes.centeredText} variant="h3">
              {userMetrics?.uniqueGenreCount || "--"}
            </Typography>
            <Typography className={classes.centeredText} variant="subtitle1">
              Unique Genres
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography className={classes.centeredText} variant="h3">
              {userMetrics?.uniqueArtistCount || "--"}
            </Typography>
            <Typography className={classes.centeredText} variant="subtitle1">
              Unique Artists
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid className={classes.chartBox} item xs={12} md={6}>
            <div style={{ height: "300px" }}>
              <Typography variant="h5">Recent Ratings</Typography>
              <ResponsiveContainer>
                <LineChart
                  width={500}
                  height={300}
                  onClick={handleSongChartClickPlay}
                  data={userMetrics?.dailyRatings.map((m) => ({
                    ...m,
                    submittedDate: format(m.submittedDate, "yyyy-MM-dd"),
                  }))}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="submittedDate" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip content={renderTooltip} />
                  <Line
                    dataKey="rating"
                    stroke={theme.palette.secondary.main}
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Grid>
          <Grid className={classes.chartBox} item xs={12} md={6}>
            <div style={{ height: "300px" }}>
              <Typography variant="h5">Top Genres</Typography>
              <ResponsiveContainer>
                <BarChart
                  width={500}
                  height={300}
                  data={userMetrics?.topGenres}
                  onClick={handleGenreChartClickPlay}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="genre" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill={theme.palette.primary.main}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Grid>
          <Grid
            className={classes.chartBox}
            item
            xs={12}
            md={6}
            style={{
              height: "360px",
              position: "relative",
              width: "100%",
            }}
          >
            <Box
              src={
                artistImgUrl ||
                // prevents broken img box when src is undefined
                "https://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif"
              }
              component="img"
              style={{
                height: "231px",
                width: "231.5px",
                opacity: !artistImgUrl ? 0 : 1,
                transition: "all .3s ease-in-out",
                position: "absolute",
                left: "calc(50% - 115.75px)",
                top: "calc(50% - 114px)",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div style={{ height: "300px" }}>
              <Typography variant="h5">Top Artists</Typography>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    onAnimationEnd={handleSpotifyArtistGet}
                    dataKey="count"
                    data={userMetrics?.topArtists}
                    fill={`${theme.palette.primary.main}75`}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      index,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      // eslint-disable-next-line
                      const radius =
                        25 + innerRadius + (outerRadius - innerRadius);
                      // eslint-disable-next-line
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      // eslint-disable-next-line
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      const artistName = userMetrics?.topArtists[index]?.artist;
                      const artistUri = artistDetailsPool?.find(
                        ({ name }) =>
                          name?.toLowerCase() == artistName.toLowerCase()
                      )?.uri;
                      return (
                        <text
                          x={x}
                          y={y}
                          style={{ cursor: artistUri ? "pointer" : "" }}
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                          fill={theme.palette.text.primary}
                          onMouseEnter={() => handleHover(artistName)}
                          onMouseLeave={() => setArtistImgUrl("")}
                          onClick={() => handleArtistClickPlay(artistUri)}
                        >
                          {artistName}
                        </text>
                      );
                    }}
                  />
                  <Tooltip content={renderPieTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Grid>
          <Grid className={classes.chartBox} item xs={12} md={6}>
            <div style={{ height: "300px" }}>
              <Typography variant="h5">Top Songs</Typography>
              <ResponsiveContainer>
                <BarChart
                  width={500}
                  height={300}
                  data={userMetrics?.topSongs.map((m, i) => ({
                    ...m,
                    ranking: `#${i + 1}`,
                  }))}
                  layout="vertical"
                  onClick={handleSongChartClickPlay}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis type="category" dataKey="ranking" />
                  <Tooltip content={renderTooltip} />
                  <Bar
                    dataKey="rating"
                    fill={theme.palette.secondary.main}
                    barSize={6}
                  >
                    <LabelList
                      dataKey="title"
                      position="top"
                      fill={theme.palette.text.primary}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default MyCharts;
