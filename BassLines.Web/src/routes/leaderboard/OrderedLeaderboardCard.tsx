import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { UserLeaderboardModel } from "../../data/src";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import makeStyles from "@mui/styles/makeStyles";

interface IProps {
  itemToBeRanked: keyof UserLeaderboardModel;
  nameOfItem?: keyof UserLeaderboardModel;
  title: string;
  users: UserLeaderboardModel[];
}

const OrderedLeaderboardCard = (props: IProps) => {
  const { itemToBeRanked, title, users, nameOfItem } = props;
  const [expanded, setExpanded] = React.useState(false);
  const classes = useStyles();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const clonedUsers = [...users];

  clonedUsers.sort((l, r) => {
    if (l[itemToBeRanked] > r[itemToBeRanked]) {
      return -1;
    } else if (l[itemToBeRanked] < r[itemToBeRanked]) {
      return 1;
    } else {
      return 0;
    }
  });

  itemToBeRanked.includes("lowest") && clonedUsers.reverse();

  const getTrophy = (user: UserLeaderboardModel) => {
    let uniqueRatings = [...new Set(clonedUsers.map((u) => u[itemToBeRanked]))];
    if (user[itemToBeRanked] === uniqueRatings[0]) return "first";
    else if (user[itemToBeRanked] === uniqueRatings[1]) return "second";
    else if (user[itemToBeRanked] === uniqueRatings[2]) return "third";
    else return undefined;
  };

  const displayRank = (user: UserLeaderboardModel, index: number) => {
    let rank = getTrophy(user);
    return (
      <>
        {rank ? (
          <img src={`img/${rank}.svg`} height="20px" width="20px" />
        ) : (
          `${index + 1}.`
        )}
      </>
    );
  };

  return (
    <Paper
      variant="outlined"
      sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, .25)" }}
    >
      <Box
        className={classes.titleBox}
        sx={{
          backgroundColor: "primary.main",
        }}
      >
        <Typography variant="h6" color="secondary.main" textAlign="center">
          {title}
          {!expanded ? (
            <ExpandMore onClick={handleClick} className={classes.titleIcon} />
          ) : (
            <ExpandLess onClick={handleClick} className={classes.titleIcon} />
          )}
        </Typography>
      </Box>
      <div style={{ padding: "10px 10px 4px 10px" }}>
        <Collapse in={expanded} collapsedSize="160px">
          {clonedUsers.map((user, index) => {
            return (
              <Grid container sx={{ paddingBottom: "8px" }}>
                <Grid
                  item
                  xs={1}
                  sx={{
                    textAlign: "right",
                    paddingRight: "12px",
                  }}
                >
                  {displayRank(user, index)}
                </Grid>
                <Grid item xs={5}>
                  {user.name}:
                </Grid>
                <Grid item xs={5} className={classes.overflowGrid}>
                  {user[nameOfItem]}
                </Grid>
                <Grid item xs={1}>
                  {user[itemToBeRanked]}
                </Grid>
              </Grid>
            );
          })}
        </Collapse>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles({
  titleBox: {
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
    padding: "8px 0",
    position: "relative",
  },
  titleIcon: {
    cursor: "pointer",
    position: "absolute",
    right: "12px",
  },
  overflowGrid: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
});

export default OrderedLeaderboardCard;
