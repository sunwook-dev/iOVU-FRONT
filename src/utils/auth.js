// 토큰 저장/삭제/조회 유틸리티 함수들

// Configuration - 환경변수 사용 (socialLogin.js와 통일)
const API_BASE_URL = "http://localhost:8081";

console.log("auth.js - API_BASE_URL:", API_BASE_URL);

// Access 토큰 저장
export const setAuthToken = (token) => {
  localStorage.setItem("access_token", token);
};

// Refresh 토큰 저장
export const setRefreshToken = (token) => {
  localStorage.setItem("refresh_token", token);
};

// Access 토큰 조회
export const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

// Refresh 토큰 조회
export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

// 로그인 상태 확인
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// 안전한 인증 데이터 삭제 함수
const clearAuthData = (forceMode = false) => {
  console.log("=== 인증 데이터 삭제 시작 ===");
  console.log("삭제 전 localStorage:", Object.keys(localStorage));

  if (forceMode) {
    // 강제 모드: 모든 데이터 삭제 (디버깅/문제 해결용)
    console.log("🔥 강제 모드: localStorage 전체 삭제");
    localStorage.clear();
  } else {
    // 일반 모드: 인증 관련 데이터만 선택적 삭제
    const authKeys = [
      // 기본 토큰들
      "access_token",
      "refresh_token",
      "user_info",
      "oauth_provider",
      // 다양한 변형들
      "accessToken",
      "refreshToken",
      "userInfo",
      "user",
      "token",
      "auth_token",
      "jwt_token",
      "id_token",
      "oauth_access_token",
      "oauth_refresh_token",
    ];

    // 알려진 키들 삭제
    authKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ 삭제: ${key}`);
        localStorage.removeItem(key);
      }
    });

    // 토큰처럼 보이는 항목들 찾아서 삭제
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value && typeof value === "string") {
        // JWT 토큰 패턴 감지
        if (
          value.includes(".") &&
          value.split(".").length === 3 &&
          value.length > 100
        ) {
          console.log(`🎯 JWT 토큰 감지하여 삭제: ${key}`);
          localStorage.removeItem(key);
        }
        // 매우 긴 토큰같은 문자열
        else if (value.length > 200 && /^[A-Za-z0-9+/=_-]+$/.test(value)) {
          console.log(`🎯 토큰같은 긴 문자열 삭제: ${key}`);
          localStorage.removeItem(key);
        }
        // 키 이름에 인증 관련 단어 포함
        else if (key.toLowerCase().match(/(token|auth|oauth|login|session)/)) {
          console.log(`🎯 인증 관련 키 삭제: ${key}`);
          localStorage.removeItem(key);
        }
      }
    });
  }

  console.log("삭제 후 localStorage:", Object.keys(localStorage));
  console.log("=== 인증 데이터 삭제 완료 ===");
};

// 로그아웃 (백엔드 API 호출 + 로컬 토큰 삭제)
export const logout = async (provider = null, redirectCallback = null) => {
  console.log("🚀 로그아웃 시작");

  try {
    // 현재 저장된 정보들을 미리 백업 (삭제 전에)
    const currentProvider =
      provider || localStorage.getItem("oauth_provider") || "unknown";
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    console.log(`🎯 Provider: ${currentProvider}`);
    console.log("🔐 토큰 상태:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    });

    // 1단계: 백엔드 로그아웃 API 호출 (토큰이 있을 때만)
    let backendLogoutSuccess = false;

    if (currentProvider !== "unknown" && accessToken) {
      try {
        console.log("🌐 백엔드 API 호출 중...");

        const requestBody = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          provider: currentProvider,
        };

        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("✅ 백엔드 로그아웃 성공:", result);
          backendLogoutSuccess = true;
        } else {
          console.warn("❌ 백엔드 로그아웃 실패:", response.status);
          backendLogoutSuccess = false;
        }
      } catch (error) {
        console.warn("💥 백엔드 API 에러:", error.message);

        // CORS 에러인 경우 특별 처리
        if (
          error.message.includes("CORS") ||
          error.message.includes("Failed to fetch")
        ) {
          console.warn("🌐 CORS 에러 또는 네트워크 연결 문제");
          console.warn("📝 로컬 로그아웃만 진행합니다");
        }

        backendLogoutSuccess = false;
      }
    } else {
      console.log("ℹ️ 토큰이 없어 로컬 로그아웃만 수행");
      backendLogoutSuccess = true; // 토큰이 없으면 성공으로 간주
    }

    // 2단계: 로컬 데이터 정리 (항상 수행)
    console.log("🔹 로컬 데이터 정리 시작");
    clearAuthData(false);

    // 3단계: 세션 정리
    try {
      sessionStorage.clear();

      // JSESSIONID 쿠키 특별 삭제 (다양한 경로에서)
      const jsessionPaths = ["/", "/api", "/oauth2", "/auth"];
      jsessionPaths.forEach((path) => {
        document.cookie = `JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
        document.cookie = `JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${window.location.hostname};`;
      });

      // 기존 일반적인 쿠키 정리도 유지
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      console.log("✅ 세션 정리 완료 (JSESSIONID 특별 삭제 포함)");
    } catch (error) {
      console.warn("세션 정리 실패:", error);
    }

    // // 4단계: 결과 처리
    // if (!backendLogoutSuccess && currentProvider !== "unknown" && accessToken) {
    //   // 백엔드 실패했지만 토큰은 있었던 경우에만 경고
    //   console.warn(
    //     "⚠️ 서버 로그아웃 실패 - 소셜 플랫폼에서 완전히 로그아웃되지 않았을 수 있습니다"
    //   );
    //   // 사용자에게 간단한 알림만
    //   if (
    //     window.confirm(
    //       "서버 로그아웃에 실패했습니다. 브라우저를 완전히 종료하는 것을 권장합니다.\n계속 진행하시겠습니까?"
    //     )
    //   ) {
    //     console.log("사용자 선택: 계속 진행");
    //   } else {
    //     console.log("사용자 선택: 로그아웃 취소");
    //     return;
    //   }
    // } else {
    //   console.log("✅ 로그아웃 완료");
    // }

    // 5단계: 토큰 재생성 방지 모니터링
    const tokenKeys = [
      "access_token",
      "refresh_token",
      "user_info",
      "oauth_provider",
    ];
    const monitorInterval = setInterval(() => {
      tokenKeys.forEach((key) => {
        if (localStorage.getItem(key)) {
          console.warn(`⚠️ ${key} 재생성 감지, 즉시 제거`);
          localStorage.removeItem(key);
        }
      });
    }, 500);

    // 3초 후 모니터링 종료
    setTimeout(() => {
      clearInterval(monitorInterval);
      console.log("모니터링 종료");
    }, 3000);

    console.log("🎯 로그아웃 프로세스 완료");
  } catch (error) {
    console.error("로그아웃 에러:", error);
    // 에러 발생 시 강제 삭제
    clearAuthData(true);
  }
};

// 사용자 정보 저장
export const setUserInfo = (userInfo) => {
  localStorage.setItem("user_info", JSON.stringify(userInfo));
};

// 사용자 정보 조회
export const getUserInfo = () => {
  const userInfo = localStorage.getItem("user_info");
  return userInfo ? JSON.parse(userInfo) : null;
};

// OAuth provider 저장
export const setOAuthProvider = (provider) => {
  localStorage.setItem("oauth_provider", provider);
};

// OAuth provider 조회
export const getOAuthProvider = () => {
  return localStorage.getItem("oauth_provider");
};

/**
 * 로그아웃 버튼 클릭 핸들러
 * 컴포넌트에서 이 함수를 사용하세요
 */
export const handleLogoutClick = async () => {
  const provider = getOAuthProvider() || "unknown";
  await logout(provider);
};

/**
 * 특정 provider로 로그아웃
 * @param {string} provider - OAuth2 provider ('google', 'kakao', 'naver')
 */
export const logoutProvider = async (provider) => {
  await logout(provider);
};

// 불필요한 localStorage 항목 정리
export const cleanupUnnecessaryTokens = () => {
  const keysToCheck = ["accessToken", "refreshToken"];
  keysToCheck.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value === "undefined" || value === "null") {
      localStorage.removeItem(key);
    }
  });

  const oauthToken = localStorage.getItem("oauth_access_token");
  if (oauthToken === "NOT_AVAILABLE") {
    localStorage.removeItem("oauth_access_token");
  }
};

export const saveAuthDataToBackend = async () => {
  const data = {
    access_token: localStorage.getItem("access_token"),
    refresh_token: localStorage.getItem("refresh_token"),
    user_info: localStorage.getItem("user_info"),
    oauth_provider: localStorage.getItem("oauth_provider"),
  };

  const response = await fetch(`${API_BASE_URL}/api/auth/save-tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to save auth data to backend");
  }
};
