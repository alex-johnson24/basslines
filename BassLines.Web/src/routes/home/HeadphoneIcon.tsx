import { Tooltip } from "@mui/material";
import SvgIcon, {SvgIconProps} from "@mui/material/SvgIcon";
import { UserModel } from "../../data/src";
import * as React from "react";

interface IProps extends SvgIconProps {
  reviewerQueue: UserModel[];
}

const TooltipQueue = (reviewerQueue: UserModel[]) => {
  return (
    <>
      <div>Upcoming Reviewers:</div>
      {reviewerQueue.length > 0 ? (
        reviewerQueue.map((m: UserModel, i: number) => (
          <div>
            {i + 1}: {m.firstName} {m.lastName}
          </div>
        ))
      ) : (
        <div>No Remaining Reviewers</div>
      )}
    </>
  );
};

const HeadphoneIcon = ({reviewerQueue, ...props}: IProps) => {
  return (
    <Tooltip title={TooltipQueue(reviewerQueue)}>
      <SvgIcon
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 115.93 84.57"
        {...props}
      >
        <defs></defs>
        <g id="Layer_2">
          <g id="Layer_1-2" data-name="Layer 1">
            <path
              fill="#50d292"
              d="M20.18,27.49H17.94a4.32,4.32,0,0,0-4.31,4.32V35.9l-.82-4.33h-.69A12.12,12.12,0,0,0,0,43.69V68.38A12.11,12.11,0,0,0,11.55,80.47l2.08-11.06V80.26a4.31,4.31,0,0,0,4.31,4.31h2.24a4.31,4.31,0,0,0,4.32-4.31V31.81A4.32,4.32,0,0,0,20.18,27.49Z"
            />
            <path
              fill="#50d292"
              d="M95.75,27.49H98a4.32,4.32,0,0,1,4.32,4.32V35.9l.81-4.33h.69a12.12,12.12,0,0,1,12.12,12.12V68.38a12.11,12.11,0,0,1-11.54,12.09l-2.08-11.06V80.26A4.31,4.31,0,0,1,98,84.57H95.75a4.32,4.32,0,0,1-4.32-4.31V31.81A4.33,4.33,0,0,1,95.75,27.49Z"
            />
            <path
              fill="#50d292"
              d="M99.55,44.06a47.66,47.66,0,0,1-.46,6.59h-.81C98.28,26.32,80.22,8.59,58,8.59S17.66,26.32,17.66,50.65h-.82a47.66,47.66,0,0,1-.46-6.59C16.38,19.73,35,0,58,0S99.55,19.73,99.55,44.06Z"
            />
          </g>
        </g>
      </SvgIcon>
    </Tooltip>
  );
};

export default HeadphoneIcon;
