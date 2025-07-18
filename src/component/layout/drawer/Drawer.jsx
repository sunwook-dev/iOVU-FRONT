import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Drawer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFileText } from "react-icons/fi";

const SidebarContent = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const handleNavigation = (path) => navigate(path);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // localStorage에서 user 정보 가져오기
    const userInfo = localStorage.getItem("user_info");
    let socialProvider = null;
    let socialId = null;
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        socialProvider = parsed.provider;
        socialId = parsed.id;
      } catch {}
    }
    // 파라미터 값 확인
    console.log("🔴 socialProvider:", socialProvider, "socialId:", socialId);
    if (!socialProvider || !socialId) {
      console.error("Missing socialProvider or socialId!");
      return;
    }

    // 1. userId 조회
    const token = localStorage.getItem("access_token");
    console.log(
      "🔴 access_token:",
      token ? "존재함" : "없음",
      token?.substring(0, 20) + "..."
    );
    fetch(
      `http://localhost:8081/api/user-id?socialProvider=${encodeURIComponent(
        socialProvider
      )}&socialId=${encodeURIComponent(socialId)}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      }
    )
      .then(async (response) => {
        console.log("🔴 userId 조회 응답:", response);
        const contentType = response.headers.get("content-type");
        // 401 Unauthorized 처리
        if (response.status === 401) {
          console.error("🔴 인증 실패 - 토큰이 만료되었거나 잘못되었습니다.");
          setReports([]);
          return;
        }
        // 로그인 페이지로 리다이렉트된 경우 처리
        if (
          response.url.includes("/login") ||
          response.url.includes("oauth2")
        ) {
          console.error(
            "🔴 로그인이 필요합니다. (백엔드에서 로그인 페이지로 리다이렉트)"
          );
          setReports([]);
          return;
        }
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`API error: ${response.status} - ${text}`);
        }
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error(
            "🔴 HTML 응답 받음 (로그인 필요):",
            text.substring(0, 200) + "..."
          );
          setReports([]);
          return;
        }
        return response.json();
      })
      .then((userRes) => {
        if (!userRes) return; // 401이나 HTML 응답일 경우
        console.log("🔴 userId 조회 결과:", userRes);
        if (!userRes.success || !userRes.userId) return setReports([]);
        const userId = userRes.userId;
        // 2. report list 조회 (토큰 포함)
        fetch(`http://localhost:8081/api/reports/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        })
          .then((res) => res.json())
          .then((reportList) => {
            console.log("🔴 report list 조회 결과:", reportList);
            // reportList['reports']가 배열이면 바로 setReports에 사용
            if (Array.isArray(reportList.reports)) {
              // reportList.reports가 [{report_id, report_title, ...}] 형태라면 바로 setReports
              setReports(
                reportList.reports.map((report) => ({
                  report_id: report.reportId,
                  report_title: report.reportTitle || "제목없음",
                }))
              );
              return;
            }
            // 기존 로직 (혹시 reportList 자체가 배열일 때)
            const reportsArr = Array.isArray(reportList) ? reportList : [];
            if (!Array.isArray(reportsArr)) return setReports([]);
            // 각 report에 대해 reportId 조회 및 reports 배열 생성
            Promise.all(
              reportsArr.map(async (report) => {
                // report_title이 반드시 있어야 함
                if (!report.report_title) return null;
                // reportId 조회 (토큰 포함)
                const res = await fetch(
                  `http://localhost:8081/api/report-id?userId=${userId}&reportTitle=${encodeURIComponent(
                    report.report_title
                  )}`,
                  {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    credentials: "include",
                  }
                );
                const data = await res.json();
                if (!data.success || !data.reportId) return null;
                return {
                  report_id: data.reportId,
                  report_title: report.report_title,
                };
              })
            ).then((finalReports) => {
              setReports(finalReports.filter(Boolean));
            });
          })
          .catch(() => setReports([]));
      })
      .catch((err) => {
        console.error("🔴 userId fetch error:", err);
        setReports([]);
      });
  }, []);

  // localStorage에서 user 정보 가져오기
  const getUserFromLocalStorage = () => {
    try {
      const userInfo = localStorage.getItem("user_info");
      if (!userInfo) return null;
      const parsed = JSON.parse(userInfo);
      return {
        name: parsed.name || parsed.nickname || "사용자",
        provider:
          parsed.provider ||
          localStorage.getItem("oauth_provider") ||
          "unknown",
        avatar:
          parsed.avatar ||
          parsed.picture ||
          parsed.profile_image ||
          "/static/images/avatar/1.jpg",
      };
    } catch {
      return null;
    }
  };
  const localUser = getUserFromLocalStorage();

  return (
    <>
      <Box sx={{ p: 2, textAlign: isSidebarOpen ? "left" : "center" }}>
        {isSidebarOpen ? (
          <Typography variant="h5" fontWeight="bold" color="primary">
            iOVU
          </Typography>
        ) : (
          <Box
            component="img"
            src="/image/iOVU_logo.png"
            alt="iOVU Logo"
            sx={{ width: 40, height: "auto", mx: "auto", display: "block" }}
          />
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isSidebarOpen ? "flex-start" : "center",
          p: 2,
          columnGap: 2,
        }}
      >
        <Avatar
          alt={localUser ? localUser.name : "Andrew Smith"}
          src={localUser ? localUser.avatar : "/static/images/avatar/1.jpg"}
          sx={{ width: 40, height: 40, mx: isSidebarOpen ? 0 : "auto" }}
        />
        {isSidebarOpen && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              {localUser ? localUser.provider : "PRODUCT MANAGER"}
            </Typography>
            <Typography variant="subtitle1" fontWeight="medium">
              {localUser ? localUser.name : "Andrew Smith"}
            </Typography>
          </Box>
        )}
      </Box>
      <Divider sx={{ my: 1 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation("/search")}
            sx={{ justifyContent: isSidebarOpen ? "initial" : "center" }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isSidebarOpen ? 3 : "auto",
                mx: isSidebarOpen ? 3 : "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FiSearch />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="새 채팅" />}
          </ListItemButton>
        </ListItem>
        {reports.map((item, idx) => (
          <ListItem
            key={item.report_id || item.report_title || idx}
            disablePadding
          >
            <ListItemButton
              onClick={() => handleNavigation(`/report/${item.report_id}`)}
              sx={{
                justifyContent: isSidebarOpen ? "initial" : "center",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isSidebarOpen ? 3 : "auto",
                  mx: isSidebarOpen ? 3 : "auto",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FiFileText />
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary={item.report_title} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

const Sidebar = ({ isSidebarOpen }) => {
  const sidebarWidth = 280;
  const collapsedSidebarWidth = 80;
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isSidebarOpen ? sidebarWidth : collapsedSidebarWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? sidebarWidth : collapsedSidebarWidth,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <SidebarContent isSidebarOpen={isSidebarOpen} />
    </Drawer>
  );
};

export default Sidebar;
