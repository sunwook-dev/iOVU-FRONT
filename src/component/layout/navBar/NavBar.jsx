import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  IconButton,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Avatar,
} from "@mui/material";
import { FiMenu } from "react-icons/fi";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import MailIcon from "@mui/icons-material/Mail";

const NavBar = () => {
  const location = useLocation(); // 현재 경로 가져오기
  const navigate = useNavigate();
  const isLandingPage = location.pathname === "/landing"; // LandingPage 여부 확인

  const clickLogo = () => {
    navigate("/search");
  };
  const handleLogout = () => {
    navigate("/");
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
          <Box sx={{ justifySelf: "end" }}>
            <Button onClick={handleLogout} color="primary">
              Logout
            </Button>
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
