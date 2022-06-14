import * as React from "react";
import Popover from "@mui/material/Popover";
import { Box, Button, ClickAwayListener, Divider, Grid, IconButton, Input, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { SongModel, SongsApi } from "../../data/src";
import { call } from "../../data/callWrapper";
import { useUserState } from "../../contexts";

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import KitesurfingSharpIcon from '@mui/icons-material/KitesurfingSharp';
import { useSongDispatch } from "../../contexts/songContext";
import { makeStyles } from "@material-ui/core";

interface IRatingPopoverProps {
  selectedSong: SongModel;
}

const useStyles = makeStyles({
  ratingDesign: {
    width: '60px',
  }
})


const RatingPopover = (props: IRatingPopoverProps) => {
  const classes = useStyles();
  const id = open ? "rating-popover" : undefined;
  const { userInfo } = useUserState();
  const dispatch = useSongDispatch();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const [ratingNum, setRatingNum] = React.useState<number | null>(null);

  React.useEffect(() => {
    setRatingNum(props.selectedSong?.rating);
  }, [props.selectedSong]);

  const handleClearField = () => {
    if (ratingNum === null) {
      setRatingNum(null);
    } else {
      setRatingNum(ratingNum)
    };
    setIsEditing(false)
  };

  const handleClickAway = () => {
    handleClearField();
    console.log("clicked away!");
  };

  return (
    <Tooltip title="Click to Rate">
      {
        isEditing ?
          <ClickAwayListener onClickAway={handleClickAway}>
            <Grid container alignItems="center" direction="row">
              <Grid item>
                <TextField
                  autoFocus
                  sx={{ width: "70px" }}
                  inputProps={{ min: 0, max: 10, style: { fontSize: "1.25rem" } }}
                  type="number"
                  // label="Score"
                  variant="standard"
                  value={ratingNum}
                  onChange={(e) => setRatingNum(Number(e.target.value))}
                />
              </Grid >
              <Stack direction="column" alignContent="center" justifyContent="center" sx={{ marginLeft: '10px', transform: 'scale(0.9)' }}>
                <Grid item >
                  <IconButton color="secondary" onClick={(e) => {
                    dispatch({
                      type: "receiveSongEvent",
                      payload: { ...props.selectedSong, rating: ratingNum, reviewer: { ...userInfo } },
                    })
                    setIsEditing(false);
                  }
                  } sx={{ marginLeft: "auto", maxHeight: "1px", maxWidth: "1px", marginBottom: "12px" }}>
                    <CheckIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={handleClearField}
                    sx={{ marginLeft: "auto", maxHeight: "1px", maxWidth: "1px", }}
                    color="primary"
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Stack >
            </Grid >
          </ClickAwayListener> : <Typography onClick={() => setIsEditing(true)} variant="h6" color={"secondary.main"} alignContent="center">
            {props.selectedSong?.rating ?? "--"}</Typography>
      }
    </Tooltip>
  );
};

export default RatingPopover;