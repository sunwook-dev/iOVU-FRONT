import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import MailIcon from "@mui/icons-material/Mail";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const clickLogo = () => {
    navigate("/search");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    alert("🔴 로그아웃 버튼이 클릭되었습니다!");
    console.log("🔴 URGENT: 로그아웃 버튼 클릭됨!");
    console.log("🔴 handleLogout 함수 실행 시작");
    console.log("=== NavBar 로그아웃 시작 ===");
    console.log(
      "로그아웃 전 localStorage:",
      Object.keys(localStorage).map(
        (key) => `${key}: ${localStorage.getItem(key)}`
      )
    );

    try {
      console.log("🔴 logout 함수 호출 전");
      await logout();
      console.log("🔴 logout 함수 호출 후");
      console.log("AuthContext logout 함수 완료");
    } catch (error) {
      console.error("🔴 AuthContext logout error:", error);
    }

    // 추가 안전장치: 백엔드 로그아웃과 관계없이 무조건 localStorage 완전 정리
    console.log("추가 localStorage 정리 시작");
    const remainingKeys = Object.keys(localStorage);
    if (remainingKeys.length > 0) {
      console.log("남아있는 localStorage 키들:", remainingKeys);
      localStorage.clear();
      console.log("강제 localStorage.clear() 완료");
    }

    // sessionStorage도 정리 (OAuth 상태 포함)
    sessionStorage.clear();

    console.log(
      "최종 localStorage 상태:",
      Object.keys(localStorage).length === 0
        ? "비어있음"
        : Object.keys(localStorage)
    );

    // 메인 페이지로 리다이렉트
    navigate("/");
    console.log("=== NavBar 로그아웃 완료 ===");
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  // // 드로어 상태 관리
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // // 드로어 열기/닫기 토글 함수
  // const toggleDrawer = (open) => (event) => {
  //   if (
  //     event &&
  //     event.type === "keydown" &&
  //     (event.key === "Tab" || event.key === "Shift")
  //   ) {
  //     return;
  //   }

  //   setIsDrawerOpen(open);
  // };

  // // 드로어 내용 컴포넌트
  // const drawerContent = () => (
  //   <Box
  //     sx={{ width: 250 }}
  //     role="presentation"
  //     onClick={toggleDrawer(false)}
  //     onKeyDown={toggleDrawer(false)}
  //   >
  //     <Box
  //       sx={{
  //         m: 2,
  //         display: "flex",
  //         columnGap: 2,
  //         alignItems: "center",
  //       }}
  //     >
  //       <Avatar></Avatar>
  //       <Typography>아이디 또는 닉네임</Typography>
  //     </Box>

  //     <Divider />
  //     <List>
  //       {["키워드 검색", "보고서"].map((text, index) => (
  //         <ListItem key={text} disablePadding>
  //           <ListItemButton
  //             onClick={() => {
  //               if (text === "SEARCH") {
  //                 // 검색 페이지로 이동
  //                 navigate("/search");
  //               } else if (text === "REPORT LIST") {
  //                 // 리포트 리스트 페이지로 이동
  //                 navigate("/reports");
  //               }
  //             }}
  //           >
  //             {/* <ListItemIcon>
  //               {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //             {/* <ListItemIcon>
  //               {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //             </ListItemIcon> */}
  //             <ListItemText primary={text} />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //   </Box>
  // );

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          minHeight: 80,
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Toolbar sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr" }}>
          {/* <Box sx={{ justifySelf: "start" }}>
            {!isLandingPage && (
              <IconButton
                size="large"
                edge="start"
                color="primary"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)} // 메뉴 아이콘 클릭시 드로어 열기
              >
                <FiMenu />
              </IconButton>
            )}
          </Box> */}

          <Box
            onClick={clickLogo}
            sx={{
              justifySelf: "center",
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            <Typography variant="h6" component="div" color="primary">
              iOVU
            </Typography>
          </Box>

          <Box
            sx={{
              justifySelf: "end",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {isLoggedIn ? (
              <>
                {user && (
                  <>
                    <Avatar
                      src={user.avatar}
                      sx={{ width: 32, height: 32, cursor: "pointer" }}
                      onClick={handleProfileClick}
                    >
                      {user.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" color="primary">
                      {user.name}
                    </Typography>
                  </>
                )}
                <Button
                  onClick={handleLogout}
                  color="primary"
                  variant="outlined"
                >
                  로그아웃
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileClose}
                  onClick={handleProfileClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleProfileClose}>프로필</MenuItem>
                  <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                </Menu>
              </>
            ) : (
              <Button onClick={handleLogin} color="primary" variant="contained">
                로그인
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 스와이프 가능한 드로어 컴포넌트
      <SwipeableDrawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {drawerContent()}
      </SwipeableDrawer> */}
    </Box>
  );
};

export default NavBar;
