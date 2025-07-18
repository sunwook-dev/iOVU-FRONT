import React from "react";
import { Box, Typography, Container, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IoLogoGithub } from "react-icons/io";
import { IoLogoYoutube } from "react-icons/io";
import { IoLogoInstagram } from "react-icons/io";
import { useTheme } from "@mui/material/styles";
import { click } from "@testing-library/user-event/dist/cjs/setup/directApi.js";

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const clickLogo = () => {
    navigate("/");
  };
  const clickGithub = () => {
    window.open("https://github.com/sunwook-dev/iOVU-FRONT", "_blank");
  };
  const clickYoutube = () => {
    window.open("https://www.youtube.com/", "_blank");
  };
  const clickInsta = () => {
    window.open("https://www.instagram.com/", "_blank");
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#EAE3D8",
          // mt: 6,
          //   opacity: 0.2,
        }}
      >
        <Container
          sx={{
            minHeight: 80,
            py: 2,
            display: "flex",
            // flexDirection: "column",
            // rowGap: 1,
            justifyContent: "center",
            columnGap: 6,
          }}
        >
          {/* 로고, 시간 */}
          <Box onClick={clickLogo} sx={{ display: "flex", cursor: "pointer" }}>
            <Typography>iOVU</Typography>
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { sm: "row", xs: "column" },
                columnGap: 2,
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize: { md: 14, xs: 12 } }}>
                10:00 ~ 17:00 (점심시간 12:00 ~ 13:00)
              </Typography>
              <Typography sx={{ fontSize: { md: 14, xs: 12 } }}>
                토/일/공휴일 휴무
              </Typography>
            </Box>

            {/* 계좌/주소 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { sm: "row", xs: "column" },
                columnGap: 1,
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize: { md: 14, xs: 12 } }}>
                계좌정보:하나은행 309-9101-***
              </Typography>
              <Typography sx={{ fontSize: { md: 14, xs: 12 } }}>
                주소: 서울시 서초구 방배천로
              </Typography>
            </Box>
            {/* 개인정보처리/이용약관/가맹점 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { sm: "row", xs: "column" },
                columnGap: 1,
                mb: 2,
                textDecoration: "none",
              }}
            >
              <Typography sx={{ fontSize: { md: 14, xs: 12 } }}>
                개인정보처리방침
              </Typography>
              <Typography sx={{ fontSize: { md: 14, xs: 12 } }}>
                이용약관
              </Typography>
              <Typography sx={{ fontSize: { md: 14, xs: 12 } }}>
                가맹점 고지사항
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                fontSize: "large",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: { md: 14, xs: 12 } }}>
                Copyright 2025. iOVU. All right reserved
              </Typography>
            </Box>
          </Box>

          {/* 전화번호 SNS */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: 1,
            }}
          >
            <Typography sx={{ fontSize: 20 }}>1234-1234</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IconButton>
                <IoLogoGithub
                  onClick={clickGithub}
                  fontSize="20px"
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                />
              </IconButton>
              <IconButton>
                <IoLogoYoutube onClick={clickYoutube} fontSize="20px" />
              </IconButton>
              <IconButton>
                <IoLogoInstagram onClick={clickInsta} fontSize="20px" />
              </IconButton>

              {/* <YouTubeIcon fontSize="medium" />
            <InstagramIcon fontSize="medium" /> */}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
