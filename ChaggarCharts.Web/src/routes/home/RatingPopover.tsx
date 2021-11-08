import * as React from "react";
import Popover from "@mui/material/Popover";
import { Box, Button, Divider, Rating, Slider, TextField } from "@mui/material";
import { SongModel, SongsApi } from "../../data/src";
import { call } from "../../data/callWrapper";

interface IRatingPopoverProps {
  anchorEl: EventTarget & HTMLButtonElement;
  handleClose: () => void;
  selectedSong: SongModel;
  setSelectedSong: React.Dispatch<React.SetStateAction<SongModel>>;
}

const RatingPopover = (props: IRatingPopoverProps) => {
  const open = Boolean(props.anchorEl);
  const id = open ? "rating-popover" : undefined;

  const submitRating = async () => {
    try {
      const ratingResult = await call(SongsApi).songsRatePut({
        songId: props.selectedSong.id,
        rating: props.selectedSong.rating,
      });
      props.handleClose();
    } catch (e) {
      console.log("song rating failed");
    }
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={props.anchorEl}
      onClose={props.handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box sx={{ padding: "10px" }}>
        {/* <TextField type="number" label="Rating" variant="outlined" /> */}
        {/* <Slider
          defaultValue={0}
          valueLabelDisplay="auto"
          step={.5}
          marks
          min={0}
          max={10}
        /> */}
        <Rating
          sx={{ padding: "5px" }}
          defaultValue={0}
          max={10}
          precision={0.5}
          value={props.selectedSong?.rating}
          onChange={(event, newValue) => {
            props.setSelectedSong((current) => ({
              ...current,
              rating: newValue,
            }));
          }}
        />
        <Divider sx={{ margin: "5px" }} />
        <Box sx={{ display: "flex" }}>
          <Button onClick={props.handleClose} sx={{ marginLeft: "auto" }} color="primary">
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={submitRating}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default RatingPopover;
