import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { SongModel } from "../data/src";
import { format } from "date-fns";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => {
  return {
    infoBlock: {
      margin: "6px 0",
    },
  };
});

interface IProps {
  song: SongModel;
  open: boolean;
  handleClose: () => void;
}

const SongDetailDialog = (props: IProps) => {
  const classes = useStyles();

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={props.open}
      sx={{ minHeight: "300px" }}
    >
      <DialogContent>
        <Grid container>
          <Grid container item xs={7}>
            <Grid className={classes.infoBlock} item xs={12}>
              <Typography variant="overline" color="inherit">Title</Typography>
              <Typography variant="h3" color="text.primary">
                {props.song?.title}
              </Typography>
            </Grid>
            <Grid className={classes.infoBlock} item xs={12}>
              <Typography variant="overline" color="inherit">Artist</Typography>
              <Typography variant="h3" color="text.primary">
                {props.song?.artist}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="overline" color="inherit">Rating</Typography>
              <Typography
                variant="h3"
                color="secondary.main"
              >{`${props.song?.rating}/10`}</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={5}>
            <Grid className={classes.infoBlock} item xs={12}>
              <Typography variant="overline" color="inherit">Submitter</Typography>
              <Typography color="primary.light" variant="h4">
                {`${props.song?.user.firstName} ${props.song?.user.lastName}`}
              </Typography>
            </Grid>
            <Grid className={classes.infoBlock} item xs={12}>
              <Typography variant="overline" color="inherit">Submitted</Typography>
              <Typography color="primary.light" variant="h4">
                {props.song
                  ? format(props.song?.submitteddate, "MM/dd/yyyy")
                  : ""}
              </Typography>
            </Grid>
            <Grid className={classes.infoBlock} item xs={12}>
              <Typography variant="overline" color="inherit">Genre</Typography>
              <Typography color="primary.light" variant="h4">
                {props.song?.genre?.name || "--"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={props.handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SongDetailDialog;
