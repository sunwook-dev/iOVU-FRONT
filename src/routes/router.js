// src/routes/router.js
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import LandingPage from "../pages/LandingPage";
import SearchPage from "../pages/SearchPage";
import Chat from "../pages/Chat";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/chats" element={<Chat />} />
    </Routes>
  );
};

export default Router;
