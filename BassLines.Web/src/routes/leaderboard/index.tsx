import * as React from "react";
import { useMutation } from "react-query";
import { UsersApi, UserLeaderboardModel } from "../../data/src";
import { call } from "../../data/callWrapper";
import OrderedLeaderboardCard from "./OrderedLeaderboardCard";
import Grid from "@mui/material/Grid";

interface rankedItemTypes {
  itemToBeRanked: keyof UserLeaderboardModel;
  nameOfItem?: keyof UserLeaderboardModel;
  title: string;
}

const Leaderboard = () => {
  const [leaderboardModels, setLeaderboardModels] = React.useState<
    UserLeaderboardModel[]
  >([]);

  var rankedItems: rankedItemTypes[] = [
    { itemToBeRanked: "bayesianAverage", title: "Top Rated Submitters" },
    { itemToBeRanked: "daysWon", title: "Most Days Won" },
    { itemToBeRanked: "numberOfLikes", title: "Users' Total Likes Received" },
    {
      itemToBeRanked: "medalsEarned",
      title: "Medals Earned",
    },
    {
      itemToBeRanked: "submissionsCount",
      title: "Number of Total Submissions",
    },
    { itemToBeRanked: "uniqueGenres", title: "Number of Unique Genres" },
    {
      itemToBeRanked: "highestRating",
      nameOfItem: "highestRatedSong",
      title: "Users' Highest Rated Song",
    },
    {
      itemToBeRanked: "lowestRating",
      nameOfItem: "lowestRatedSong",
      title: "Users' Lowest Rated Song",
    },
    {
      itemToBeRanked: "likesOnMostLikedSong",
      nameOfItem: "mostLikedSong",
      title: "Users' Most Liked Song",
    },
  ];

  const { mutateAsync: getUsersLeaderboard, status: leaderboardStatus } =
    useMutation(async () => {
      const leaderboardResults = await call(
        UsersApi
      ).apiUsersLeaderboardMetricsGet();

      setLeaderboardModels(leaderboardResults);
    });

  React.useEffect(() => {
    getUsersLeaderboard();
  }, []);

  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      {rankedItems.map((s) => (
        <Grid item xs={12} md={6} lg={4}>
          <OrderedLeaderboardCard
            itemToBeRanked={s.itemToBeRanked}
            nameOfItem={s.nameOfItem}
            title={s.title}
            users={leaderboardModels}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Leaderboard;
