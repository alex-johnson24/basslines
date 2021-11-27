import * as React from "react";
import { makeStyles } from "@mui/styles";
import {
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
import { UserMetricsModel, UserModel, UsersApi } from "../../data/src";
import { useUserState } from "../../contexts";
import { format } from "date-fns";

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
  return (
    payload?.length > 0 && (
      <Paper sx={{ padding: "10px" }}>
        <Typography
          variant="h6"
          color="primary"
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

  const [userMetrics, setUserMetrics] = React.useState<UserMetricsModel>();
  const [selectedUser, setSelectedUser] = React.useState<string>("");
  const [users, setUsers] = React.useState<UserModel[]>([]);

  React.useEffect(() => {
    const getUsers = async () => {
      try {
        let users = await call(UsersApi).usersAllUsersGet();
        setUsers(users);
      } catch (e) {}
    };
    getUsers();
  }, []);

  React.useEffect(() => {
    if (selectedUser) {
      const getUserMetrics = async (userId: string) => {
        try {
          let userData = await call(UsersApi).usersUserMetricsGet({ userId });
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
          {users.map((m) => (
            <MenuItem value={m.id}>{`${m.firstName} ${m.lastName}`}</MenuItem>
          ))}
        </Select>
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
          <Grid className={classes.chartBox} item xs={12} md={6}>
            <div style={{ height: "300px" }}>
              <Typography variant="h5">Top Artists</Typography>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey="count"
                    data={userMetrics?.topArtists}
                    fill={theme.palette.primary.main}
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

                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                        >
                          {userMetrics?.topArtists[index]?.artist}
                        </text>
                      );
                    }}
                  />
                  <Tooltip content={renderPieTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
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
                    <LabelList dataKey="title" position="top" />
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
