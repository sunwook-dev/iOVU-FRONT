import { Paper } from "@mui/material";

const CommonPaper = ({ children, sx }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        minWidth: "300px",
        minHeight: "160px",
        borderRadius: 3,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

export default CommonPaper;
