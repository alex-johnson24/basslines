import { Box, Collapse, Grid, Paper, Typography } from "@mui/material";
import * as React from "react";
import { UserLeaderboardModel } from "../../data/src";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import makeStyles from "@mui/styles/makeStyles";

interface IProps {
  itemToBeRanked: keyof UserLeaderboardModel;
  title: string;
  users: UserLeaderboardModel[];
}

const NumericLeaderboardCard = (props: IProps) => {
  const { itemToBeRanked, title, users } = props;
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

  return (
    <Paper
      variant="outlined"
      sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, .25)" }}
    >
      <Box
        className={classes.titleBox}
        sx={{ backgroundColor: "primary.main" }}
      >
        <Typography variant="h6" color="secondary.main" textAlign="center">
          {title}
          {!expanded ? (
            <ExpandMoreIcon
              onClick={handleClick}
              className={classes.titleIcon}
            />
          ) : (
            <ExpandLessIcon
              onClick={handleClick}
              className={classes.titleIcon}
            />
          )}
        </Typography>
      </Box>
      <div style={{ padding: "10px 10px 4px 10px" }}>
        <Collapse in={expanded} collapsedSize="160px">
          {clonedUsers.map((user, index) => {
            let rank =
              index === 0
                ? "first"
                : index === 1
                ? "second"
                : index === 2
                ? "third"
                : undefined;
            return (
              <Grid container sx={{ paddingBottom: "8px" }}>
                <Grid item xs={1}>
                  {index + 1}.{" "}
                  {!!rank && (
                    <img src={`${rank}.svg`} height="20px" width="20px" />
                  )}
                </Grid>
                <Grid item xs={9}>
                  {user.name}:
                </Grid>
                <Grid item xs={2} className={classes.overflowGrid}>
                  {user[itemToBeRanked] ?? "--"}
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
    display: "flex",
    justifyContent: "center",
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
    textAlign: "center",
  },
});

export default NumericLeaderboardCard;
