import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Divider, Typography, IconButton } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { IoClose } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };
  const socialLogins = [
    {
      name: "Google",
      icon: <FcGoogle size={22} />,
    },
    {
      name: "Kakao",
      icon: <RiKakaoTalkFill size={22} />,
    },
    {
      name: "Naver",
      icon: <SiNaver size={22} color="#03C75A" />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#343a40",
      }}
    >
      <Box
        sx={{
          width: "1000px",
          minHeight: "500px",
          backgroundColor: "white",
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          position: "relative",
        }}
      >
        {/* X 버튼 - 오른쪽 상단 */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 40,
            height: 40,
            backgroundColor: "#f5f5f5",
            color: "#666",
            zIndex: 10,
            "&:hover": {
              backgroundColor: "#e0e0e0",
              color: "#333",
            },
          }}
        >
          <IoClose size={20} />
        </IconButton>
        {/* Left Side */}
        <Box
          sx={{
            flex: 1,
            p: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Welcome Back 👋
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 2, mb: 4 }}
          >
            Today is a new day. It's your day. You shape it.
            <br />
            Sign in to start managing your projects.
          </Typography>

          <Divider sx={{ my: 2 }}>
            <Typography variant="overline">Here</Typography>
          </Divider>

          {socialLogins.map((social) => (
            <Button
              key={social.name}
              fullWidth
              variant="contained"
              startIcon={social.icon}
              sx={{
                mb: 2,
                py: 1.5,
                bgcolor: "#f5f7f9",
                color: "text.primary",
                textTransform: "none",
                fontWeight: "medium",
                "&:hover": {
                  bgcolor: "#e8ecef",
                },
              }}
            >
              Sign in with {social.name}
            </Button>
          ))}
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <img
              src="/image/searchBanner.png"
              alt="Login Illustration"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
