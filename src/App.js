import "./App.css";
import Layout from "./component/layout/Layout";
import Router from "./routes/router";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Layout>
          <Router />
        </Layout>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
