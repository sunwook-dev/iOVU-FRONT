import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonButton from "../common/CommonButton";
import { TbBrandKakoTalk } from "react-icons/tb";

const KakaoLogin = () => {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const KAKAO_CLIENT_ID = "REST_API_키";
  const REDIRECT_URI = "http://localhost:3000/auth/kakao";
  //   const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  useEffect(() => {
    // 카카오 SDK 동적 로드
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      window.Kakao.init("JavaScript_키");
      setIsKakaoLoaded(true);
      console.log("Kakao SDK loaded:", window.Kakao.isInitialized());
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const loginWithKakao = () => {
    if (!isKakaoLoaded) {
      console.error("카카오 SDK가 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.login({
      success: function (authObj) {
        console.log(authObj);

        // 사용자 정보 요청
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: function (res) {
            console.log(res);
            // 서버에 토큰과 사용자 정보 전송
            sendToServer(authObj.access_token, res);
          },
          fail: function (error) {
            console.log(error);
          },
        });
      },
      fail: function (err) {
        console.log(err);
      },
      scope: "profile_nickname, account_email",
    });
  };

  const sendToServer = async (token, userData) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/kakao",
        {
          access_token: token,
          user_info: userData,
        }
      );
      console.log(response.data);
      // 로그인 성공 후 처리 (예: 토큰 저장, 리다이렉트 등)
      localStorage.setItem("token", response.data.token);
      window.location.href = "/dashboard"; // 로그인 후 이동할 페이지
    } catch (error) {
      console.error("로그인 처리 오류:", error);
    }
  };
  return (
    <CommonButton
      onClick={loginWithKakao}
      variant="outlined"
      sx={{
        backgroundColor: "#FEE500",
        px: 5,
      }}
    >
      <TbBrandKakoTalk
        fontSize="large"
        style={{
          marginRight: 8,
        }}
      />
      카카오로 로그인
    </CommonButton>
  );
};
export default KakaoLogin;
