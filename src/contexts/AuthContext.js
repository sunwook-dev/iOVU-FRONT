import React, { createContext, useContext, useState, useEffect } from "react";
import {
  isAuthenticated,
  getUserInfo,
  logout as authLogout,
} from "../utils/auth";

// AuthContext 생성
const AuthContext = createContext();

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    setLoading(true);
    try {
      if (isAuthenticated()) {
        const userInfo = getUserInfo();
        setUser(userInfo);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 로그인 함수
  const login = (userInfo) => {
    setUser(userInfo);
  };

  // 로그아웃 함수
  const logout = async () => {
    console.log("🔵 AuthContext logout 시작");

    try {
      // 백엔드 API 로그아웃 호출
      await authLogout();
      console.log("✅ 백엔드 로그아웃 완료");
    } catch (error) {
      console.error("❌ 백엔드 로그아웃 실패:", error);
      // 백엔드 실패해도 로컬 상태는 정리
    }

    // 상태 초기화
    setUser(null);
    console.log("✅ AuthContext 상태 초기화 완료");
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
