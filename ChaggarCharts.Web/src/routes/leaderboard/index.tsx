import * as React from "react";
import { useMutation } from "react-query";
import { UsersApi, UserLeaderboardModel } from "../../data/src";
import { call } from "../../data/callWrapper";
import NumericLeaderboardCard from "./NumericLeaderboardCard";
import OrderedLeaderboardCard from "./OrderedLeaderboardCard";
import { Grid } from "@mui/material";

interface itemsTypes {
  itemToBeRanked: keyof UserLeaderboardModel;
  title: string;
}

interface rankedItemTypes {
  itemToBeRanked: keyof UserLeaderboardModel;
  ranking?: keyof UserLeaderboardModel;
  title: string;
}

const Leaderboard = () => {
  const [leaderboardModels, setLeaderboardModels] = React.useState<
    UserLeaderboardModel[]
  >([]);

  var items: itemsTypes[] = [
    { itemToBeRanked: "average", title: "Highest Average Users" },
    { itemToBeRanked: "daysWon", title: "Most Days Won" },
    { itemToBeRanked: "numberOfLikes", title: "Users' Total Likes Received" },
    {
      itemToBeRanked: "songsAdded",
      title: "Songs Added to Chaggar's Playlist",
    },
    {
      itemToBeRanked: "submissionsCount",
      title: "Number of Total Submissions",
    },
    { itemToBeRanked: "uniqueGenres", title: "Number of Unique Genres" },
  ];

  var rankedItems: rankedItemTypes[] = [
    {
      itemToBeRanked: "highestRatedSong",
      ranking: "highestRating",
      title: "Users' Highest Rated Song",
    },
    {
      itemToBeRanked: "lowestRatedSong",
      ranking: "lowestRating",
      title: "Users' Lowest Rated Song",
    },
    {
      itemToBeRanked: "mostLikedSong",
      ranking: "likesOnMostLikedSong",
      title: "Users' Most Liked Song",
    },
  ];

  const { mutateAsync: getUsersLeaderboard, status: leaderboardStatus } =
    useMutation(async () => {
      const leaderboardResults = await call(
        UsersApi
      ).usersLeaderboardMetricsGet();
      let filteredResults = leaderboardResults.filter(
        (user) => user.submissionsCount !== 0
      );

      setLeaderboardModels(filteredResults);
    });

  React.useEffect(() => {
    getUsersLeaderboard();
  }, []);

  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      {items.map((s) => (
        <Grid item xs={12} md={6} lg={4}>
          <NumericLeaderboardCard
            itemToBeRanked={s.itemToBeRanked}
            title={s.title}
            users={leaderboardModels}
          />
        </Grid>
      ))}
      {rankedItems.map((s) => (
        <Grid item xs={12} md={6} lg={4}>
          <OrderedLeaderboardCard
            itemToBeRanked={s.itemToBeRanked}
            rating={s.ranking}
            title={s.title}
            users={leaderboardModels}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Leaderboard;
