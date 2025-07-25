// src/routes/router.js
import { Route, Routes } from "react-router-dom";

import Chat from "../pages/Chat";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import OAuth2Callback from "../pages/OAuth2Callback";
import SearchPage from "../pages/SearchPage";
import ReportDetailPage from "../pages/ReportDetailPage";

// ReportDetailPageWrapper 정의
import { useParams } from "react-router-dom";
function ReportDetailPageWrapper() {
  const { id } = useParams();
  return <ReportDetailPage reportId={id} />;
}

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />
      {/* 백엔드가 /callback로 리다이렉트하는 경우 대응 */}
      <Route path="/callback" element={<OAuth2Callback />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/chats" element={<Chat />} />
      {/* 여기에서 Wrapper 사용 */}
      <Route path="/report/:id" element={<ReportDetailPageWrapper />} />
      {/* 디버깅: 잘못된 경로 접근 확인 */}
      <Route
        path="*"
        element={
          <div>Page not found. Current path: {window.location.pathname}</div>
        }
      />
    </Routes>
  );
};

export default Router;
