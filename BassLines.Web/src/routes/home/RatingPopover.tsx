import * as React from "react";
import Popover from "@mui/material/Popover";
import { Box, Button, Divider, TextField } from "@mui/material";
import { SongModel, SongsApi } from "../../data/src";
import { call } from "../../data/callWrapper";
import { useUserState } from "../../contexts";

interface IRatingPopoverProps {
  anchorEl: EventTarget & HTMLButtonElement;
  handleClose: () => void;
  selectedSong: SongModel;
  setSelectedSong: React.Dispatch<React.SetStateAction<SongModel>>;
}

const RatingPopover = (props: IRatingPopoverProps) => {
  const open = Boolean(props.anchorEl);
  const id = open ? "rating-popover" : undefined;
  const { userInfo } = useUserState();

  const submitRating = async () => {
    try {
      await call(SongsApi).apiSongsPut({ songModel: props.selectedSong });
      props.handleClose();
    } catch (e) {
      console.log("song rating failed", e);
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
        <TextField
          InputProps={{ inputProps: { min: 0, max: 10 } }}
          type="number"
          label="Rating"
          variant="outlined"
          value={props.selectedSong?.rating}
          onChange={(event) => {
            event.persist();
            props.setSelectedSong((current) => ({
              ...current,
              rating: Number(event.target.value),
              reviewer: {...userInfo},
            }));
          }}
        />
        <Divider sx={{ margin: "5px" }} />
        <Box sx={{ display: "flex" }}>
          <Button
            onClick={props.handleClose}
            sx={{ marginLeft: "auto" }}
            color="primary"
          >
            Cancel
          </Button>
          <Button color="secondary" variant="outlined" onClick={submitRating}>
            Save
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default RatingPopover;
