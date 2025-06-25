import { ReactNode } from "react";
import { Typography } from "@mui/material";

const CommonTitle = ({ children, sx, ...others }) => {
  return (
    <>
      <Typography
        sx={{
          textAlign: "flex-start",
          py: 2,
          px: 1,
          fontWeight: 600,
          fontSize: 24,
          ...sx,
        }}
        {...others}
      >
        {children}
      </Typography>
    </>
  );
};

export default CommonTitle;
