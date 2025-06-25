import React from "react";
import { Button } from "@mui/material";

const CommonButton = ({
  children,
  variant = "contained",
  color = "primary",
  size = "large",
  sx = {},
  ...others
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      sx={{
        m: 1,
        ...sx,
      }}
      {...others}
    >
      {children}
    </Button>
  );
};
export default CommonButton;
