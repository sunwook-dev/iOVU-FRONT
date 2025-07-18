// 소셜 로그인 관련 API 함수들

import {
  setAuthToken,
  setRefreshToken,
  setUserInfo,
  setOAuthProvider,
} from "../utils/auth";

// 환경 변수에서 API URL 가져오기, 없으면 에러 발생
const API_BASE_URL = "http://localhost:8081";

if (!API_BASE_URL) {
  console.error("REACT_APP_API_URL 환경 변수가 설정되지 않았습니다.");
}

// Google 로그인
export const loginWithGoogle = async () => {
  try {
    if (!API_BASE_URL) {
      throw new Error("API 서버 주소가 설정되지 않았습니다.");
    }
    // 백엔드의 Google OAuth2 엔드포인트로 리다이렉트
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  } catch (error) {
    console.error("Google login failed:", error);
    return { success: false, error: error.message };
  }
};

// Kakao 로그인
export const loginWithKakao = async () => {
  try {
    if (!API_BASE_URL) {
      throw new Error("API 서버 주소가 설정되지 않았습니다.");
    }
    // 백엔드의 Kakao OAuth2 엔드포인트로 리다이렉트
    window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
  } catch (error) {
    console.error("Kakao login failed:", error);
    return { success: false, error: error.message };
  }
};

// Naver 로그인
export const loginWithNaver = async () => {
  try {
    if (!API_BASE_URL) {
      throw new Error("API 서버 주소가 설정되지 않았습니다.");
    }
    // 백엔드의 Naver OAuth2 엔드포인트로 리다이렉트
    window.location.href = `${API_BASE_URL}/oauth2/authorization/naver`;
  } catch (error) {
    console.error("Naver login failed:", error);
    return { success: false, error: error.message };
  }
};

// OAuth2 콜백 처리 (백엔드에서 리다이렉트된 후 호출)
export const handleOAuth2Callback = (
  token,
  refreshToken,
  userInfo,
  provider = null
) => {
  try {
    console.log("🔧 handleOAuth2Callback 호출됨:", {
      token: token ? "present" : "missing",
      refreshToken: refreshToken ? "present" : "missing",
      userInfo: userInfo ? "present" : "missing",
      provider: provider || "missing",
      providerType: typeof provider,
    });

    // 유효한 값만 저장
    if (token && token !== "undefined") {
      setAuthToken(token);
      console.log("✅ Access token 저장됨");
    }

    if (refreshToken && refreshToken !== "undefined") {
      setRefreshToken(refreshToken);
      console.log("✅ Refresh token 저장됨");
    }

    if (userInfo && userInfo !== "undefined") {
      setUserInfo(userInfo);
      console.log("✅ User info 저장됨");
    }

    // OAuth provider 정보 저장 (로그아웃 시 사용)
    if (provider && provider !== "undefined" && provider !== "null") {
      setOAuthProvider(provider);
      console.log("✅ OAuth provider 저장됨:", provider);
    } else {
      console.warn("⚠️ Provider 정보 누락:", provider);

      // Provider를 userInfo에서 추출 시도
      if (userInfo && typeof userInfo === "object") {
        const extractedProvider =
          userInfo.provider ||
          userInfo.social_provider ||
          userInfo.oauth_provider;
        if (extractedProvider) {
          setOAuthProvider(extractedProvider);
          console.log(
            "✅ UserInfo에서 provider 추출하여 저장:",
            extractedProvider
          );
        }
      }
    }

    console.log("🔍 저장 후 localStorage 확인:", {
      access_token: !!localStorage.getItem("access_token"),
      refresh_token: !!localStorage.getItem("refresh_token"),
      user_info: !!localStorage.getItem("user_info"),
      oauth_provider: localStorage.getItem("oauth_provider"),
    });

    return { success: true, user: userInfo };
  } catch (error) {
    console.error("OAuth2 callback handling failed:", error);
    return { success: false, error: error.message };
  }
};

// 토큰 갱신
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    setAuthToken(data.accessToken);

    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }

    return { success: true, accessToken: data.accessToken };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return { success: false, error: error.message };
  }
};
