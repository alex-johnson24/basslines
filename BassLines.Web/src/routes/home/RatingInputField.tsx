import * as React from "react";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { SongModel, SongsApi } from "../../data/src";
import { call } from "../../data/callWrapper";
import { useUserState } from "../../contexts";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import { SxProps, Theme } from "@mui/material";

interface IRatingInputField {
  selectedSong: SongModel;
  sx: SxProps<Theme>;
}

const RatingInputField = (props: IRatingInputField) => {

  const { userInfo, userCanReview } = useUserState();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const [ratingNum, setRatingNum] = React.useState<number | null>(null);

  React.useEffect(() => {
    setRatingNum(props.selectedSong?.rating);
  }, [props.selectedSong]);

  const submitRating = async (toSubmit: SongModel) => {
    try {
      await call(SongsApi).apiSongsPut({ songModel: toSubmit });
      setIsEditing(false);
    } catch (e) {
      console.log("song rating failed", e);
    }
  };

  const handleClearField = () => {
    setRatingNum(props.selectedSong?.rating);
    setIsEditing(false);
  };

  return (
    <Tooltip title={userCanReview && !isEditing ? "Click to Rate" : ""}>
      <Box
        component="div"
        sx={{ cursor: userCanReview ? "pointer" : "unset", ...props.sx }}
      >
        {isEditing ? (
          <ClickAwayListener onClickAway={handleClearField}>
            <Grid container alignItems="center" direction="row">
              <Grid item>
                <TextField
                  autoFocus
                  sx={{ width: "70px" }}
                  inputProps={{
                    min: 0,
                    max: 10,
                    style: { fontSize: "1.25rem" },
                  }}
                  type="number"
                  variant="standard"
                  value={ratingNum}
                  onChange={(e) => setRatingNum(Number(e.target.value))}
                />
              </Grid>
              <Stack
                direction="column"
                alignContent="center"
                justifyContent="center"
                sx={{ marginLeft: "10px", transform: "scale(0.9)" }}
              >
                <Grid item>
                  <IconButton
                    color="secondary"
                    onClick={(e) => {
                      submitRating({
                        ...props.selectedSong,
                        rating: ratingNum,
                        reviewer: { ...userInfo },
                      });
                    }}
                    sx={{
                      marginLeft: "auto",
                      maxHeight: "1px",
                      maxWidth: "1px",
                      marginBottom: "12px",
                    }}
                  >
                    <Check />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={handleClearField}
                    sx={{
                      marginLeft: "auto",
                      maxHeight: "1px",
                      maxWidth: "1px",
                    }}
                    color="primary"
                  >
                    <Close />
                  </IconButton>
                </Grid>
              </Stack>
            </Grid>
          </ClickAwayListener>
        ) : (
          <Typography
            onClick={() => (userCanReview ? setIsEditing(true) : {})}
            variant="h4"
            color="secondary.main"
            alignContent="center"
          >
            {props.selectedSong?.rating ?? "--"}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default RatingInputField;
