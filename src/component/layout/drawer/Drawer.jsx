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
  const reports = [
    { text: "보고서 1 (제목 요약)", path: "/reports/1" },
    { text: "보고서 2 (제목 요약)", path: "/reports/2" },
    { text: "보고서 3 (제목 요약)", path: "/reports/3" },
  ];
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
          alt="Andrew Smith"
          src="/static/images/avatar/1.jpg"
          sx={{ width: 40, height: 40, mx: isSidebarOpen ? 0 : "auto" }}
        />
        {isSidebarOpen && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              PRODUCT MANAGER
            </Typography>
            <Typography variant="subtitle1" fontWeight="medium">
              Andrew Smith
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
        {reports.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
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
              {isSidebarOpen && <ListItemText primary={item.text} />}
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
