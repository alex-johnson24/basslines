import * as React from "react";
import Popover from "@mui/material/Popover";
import { Box, Button, ClickAwayListener, Divider, Grid, IconButton, Input, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { SongModel, SongsApi, UserRole } from "../../data/src";
import { call } from "../../data/callWrapper";
import { useUserState } from "../../contexts";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useSongDispatch } from "../../contexts/songContext";

interface IRatingInputField {
  selectedSong: SongModel;
}

const RatingInputField = (props: IRatingInputField) => {
  const id = open ? "rating-popover" : undefined;
  const { userInfo, userCanReview } = useUserState();
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
    <Tooltip title={userCanReview ? "Click to Rate" : ''} sx={{ cursor: userCanReview ? "pointer" : "unset"}}>
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
          </ClickAwayListener> : <Typography onClick={() => userCanReview ? setIsEditing(true) : {}} variant="h6" color={"secondary.main"} alignContent="center">
            {props.selectedSong?.rating ?? "--"}</Typography>
      }
    </Tooltip>
  );
};

export default RatingInputField;