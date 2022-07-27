import { Box, SvgIcon, Typography } from "@mui/material";
import * as React from "react";
import { UserModel } from "../../data/src/models";

interface IProps {
  index: number;
  reviewer: UserModel;
}

export default function ReviewerQueueEntry(props: IProps) {
  const BackdropSvg = () => {
    return (
      <SvgIcon>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle fill="#50d292" cx="50" cy="50" r="35" />
          <text x="50" y="65" fill="#FFF" font-size="45px" text-anchor="middle">
            {props.index}
          </text>
        </svg>
      </SvgIcon>
    );
  };

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
      <BackdropSvg />
      <Typography
        variant="subtitle2"
        sx={{ margin: "0 10px 0 5px", whiteSpace: "nowrap" }}
      >{`${props.reviewer?.firstName} ${props.reviewer?.lastName}`}</Typography>
    </Box>
  );
}
