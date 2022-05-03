import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { SongModel } from "../data/src";
import { format } from "date-fns";

interface IProps {
  song: SongModel;
  open: boolean;
  handleClose: () => void;
}

const SongDetailDialog = (props: IProps) => {

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={props.open}
      sx={{ minHeight: "300px"}}
      >
      <DialogContent>
          <CloseIcon onClick={props.handleClose} sx={{cursor: "pointer", right: "24px", position: "absolute"}}/>
          <Grid container item xs={12}>
            <Grid item xs={4}>
              <div style={{display: "inline-block", textAlign: "left"}}>
              <Typography variant="overline" color="inherit">Title</Typography>
              <Typography variant="h4" color="text.primary">
                {props.song?.title}
              </Typography>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div style={{display: "inline-block", textAlign: "left"}}>
              <Typography variant="overline" color="inherit">Artist</Typography>
              <Typography variant="h4" color="text.primary">
                {props.song?.artist}
              </Typography>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div style={{display: "inline-block", textAlign: "left"}}>
              <Typography variant="overline" color="inherit">Rating</Typography>
              <Typography
                variant="h4"
                color="secondary.main"
              >{`${props.song?.rating}/10`}</Typography>
              </div>
            </Grid>           
          </Grid>
          <hr style={{marginBottom: "32px", opacity: ".33"}}/>
          <Grid container>
            <Grid container item xs={6}>
              <Grid item xs={12}>
                <div style={{display: "inline-block", textAlign: "left", marginBottom: "24px"}}>
                <Typography variant="overline" color="inherit">Submitter</Typography>
                <Typography color="primary.light" variant="h5">
                  {`${props.song?.user.firstName} ${props.song?.user.lastName}`}
                </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{display: "inline-block", textAlign: "left"}}>
                <Typography variant="overline" color="inherit">Reviewer</Typography>
                <Typography color="primary.light" variant="h5">
                  {`${props.song?.reviewer.firstName} ${props.song?.reviewer.lastName}`}
                </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container item xs={6}>
              <Grid item xs={12}>
                <div style={{display: "inline-block", textAlign: "left", marginBottom: "24px"}}>
                <Typography variant="overline" color="inherit">Submitted</Typography>
                <Typography color="primary.light" variant="h5">
                  {props.song
                    ? format(props.song?.submitteddate, "MM/dd/yyyy")
                    : ""}
                </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{display: "inline-block", textAlign: "left"}}>
                <Typography variant="overline" color="inherit">Genre</Typography>
                <Typography color="primary.light" variant="h5">
                  {props.song?.genre?.name || "--"}
                </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SongDetailDialog;
