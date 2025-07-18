import { Alert, Box, Button, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { loginWithGoogle, loginWithKakao, loginWithNaver } from "../services/socialLogin";
import { useNavigate, useSearchParams } from "react-router-dom";

import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // URL에서 에러 메시지 확인
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleClose = () => {
    navigate("/");
  };

  // 소셜 로그인 핸들러
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError("");

    try {
      switch (provider) {
        case "Google":
          await loginWithGoogle();
          break;
        case "Kakao":
          await loginWithKakao();
          break;
        case "Naver":
          await loginWithNaver();
          break;
        default:
          throw new Error("Unsupported provider");
      }
      // OAuth2 리다이렉트가 발생하므로 여기서는 추가 처리 불필요
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
      console.error("Login error:", err);
      setLoading(false);
    }
  };
  const socialLogins = [
    {
      name: "Google",
      icon: <FcGoogle size={22} />,
      color: "#4285f4",
    },
    {
      name: "Kakao",
      icon: <RiKakaoTalkFill size={22} />,
      color: "#fee500",
    },
    {
      name: "Naver",
      icon: <SiNaver size={22} color="#03C75A" />,
      color: "#03C75A",
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

          {/* 에러 메시지 */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Divider sx={{ my: 2 }}>
            <Typography variant="overline">소셜 로그인</Typography>
          </Divider>

          {socialLogins.map((social) => (
            <Button
              key={social.name}
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : social.icon}
              onClick={() => handleSocialLogin(social.name)}
              disabled={loading}
              sx={{
                mb: 2,
                py: 1.5,
                bgcolor: social.name === "Kakao" ? "#fee500" : "#f5f7f9",
                color: social.name === "Kakao" ? "#000" : "text.primary",
                textTransform: "none",
                fontWeight: "medium",
                "&:hover": {
                  bgcolor: social.name === "Kakao" ? "#e6cf00" : "#e8ecef",
                },
                "&:disabled": {
                  bgcolor: "#f0f0f0",
                  color: "#999",
                },
              }}
            >
              {loading ? "로그인 중..." : `${social.name}로 로그인`}
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
