import { Typography } from "@mui/material";

const CommonSubtitle = ({ children }) => {
  return (
    <>
      <Typography
        variant="subtitle2"
        color="secondary"
        sx={{ display: "flex", mt: 1 }}
      >
        {children}
      </Typography>
    </>
  );
};
export default CommonSubtitle;
