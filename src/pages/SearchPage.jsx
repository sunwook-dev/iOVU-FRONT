import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate("/chats");
  };

  return (
    <Container
      sx={{
        width: "1000px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        cursor: "default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: 6,
          mt: 40,
        }}
      >
        <img
          src="/image/iOVU_logo.png"
          alt="iOVU Logo"
          style={{
            userSelect: "none",
            pointerEvents: "none",
          }}
        />

        <TextField
          placeholder="브랜드에 대해 궁금한 점을 입력하세요."
          variant="outlined"
          size="medium"
          sx={{ width: 600, cursor: "default", backgroundColor: "#ffffff" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          InputProps={{
            sx: {
              "& input": {
                "&::placeholder": {
                  color: "#424242",
                  opacity: 0.8,
                },
                backgroundColor: "transparent",
                "&:focus-within": {
                  backgroundColor: "transparent",
                },
                "&.Mui-focused": {
                  backgroundColor: "transparent",
                },
              },
              height: 100,
              borderRadius: 4,
              cursor: "default",
              backgroundColor: "transparent",
              "&:focus-within": {
                backgroundColor: "transparent",
              },
              "&.Mui-focused": {
                backgroundColor: "transparent",
              },
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSearch}
                  sx={{
                    boxShadow: "none",
                    "&:hover": {},
                    "&:hover img": {
                      transform: "scale(1.2)",
                      filter: "brightness(1.3)",
                    },
                  }}
                >
                  <img
                    src="/image/search.png"
                    alt="검색"
                    style={{
                      width: 20,
                      height: 20,
                      transition: "all 0.3s ease",
                    }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Container>
  );
};
export default SearchPage;
