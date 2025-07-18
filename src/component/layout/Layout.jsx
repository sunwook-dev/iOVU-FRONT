import { useLocation } from "react-router-dom";
import { Box, Button, IconButton } from "@mui/material";
import Sidebar from "./drawer/Drawer";
import { useNavigate } from "react-router-dom";
import CommonPaper from "../common/CommonPaper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSidebar } from "../../contexts/SidebarContext";
import { useAuth } from "../../contexts/AuthContext"; // 추가

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { logout } = useAuth(); // 추가

  const { isSidebarOpen, toggleSidebar } = useSidebar();

  if (path === "/login" || path === "/" || path === "/landing")
    return <>{children}</>;

  const handleLogout = async () => {
    console.log("🔴 Layout 로그아웃 시작");
    
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Layout 로그아웃 에러:", error);
      navigate("/"); // 에러가 발생해도 메인 페이지로 이동
    }
  };

  const sidebarWidth = 280;
  const collapsedSidebarWidth = 80;
  const btnSize = 28;

  const toggleBtnStyle = {
    position: "absolute",
    top: "47%",
    left: isSidebarOpen
      ? `${sidebarWidth - btnSize / 2}px`
      : `${collapsedSidebarWidth - btnSize / 2}px`,
    zIndex: 1301,
    width: btnSize,
    height: btnSize,
    background: "#fff",
    borderRadius: "6px",
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06)",
    border: "1.5px solid #f3f3f3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    transition:
      "left 0.2s cubic-bezier(.4,0,.2,1), top 0.2s cubic-bezier(.4,0,.2,1)",
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fafafa" }}>
      {/* 사이드바 */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* 토글 버튼 */}
      <IconButton onClick={toggleSidebar} sx={toggleBtnStyle}>
        {isSidebarOpen ? (
          <IoIosArrowBack size={18} />
        ) : (
          <IoIosArrowForward size={18} />
        )}
      </IconButton>

      {/* 본문 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          maxWidth: "100vw",
          ml: 4,
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          position: "relative",
        }}
      >
        {/* 로그인 버튼 우상단 */}
        <Box sx={{ position: "absolute", top: 32, right: 40, zIndex: 1200 }}>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Logout
          </Button>
        </Box>

        {/* 본문 컨텐츠 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            maxWidth: "100%",
            minHeight: "100vh",
            pt: 10,
          }}
        >
          <CommonPaper
            sx={{
              width: "calc(100% - 24px)",
              maxWidth: "100vw",
              minHeight: "90vh",
              mt: 1.5,
              mb: 1.5,
              mr: 1.5,
              ml: 0.375,
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {children}
          </CommonPaper>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
