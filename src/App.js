import "./App.css";
import Layout from "./component/layout/Layout";
import Router from "./routes/router";
import { SidebarProvider } from "./contexts/SidebarContext";

function App() {
  return (
    <SidebarProvider>
      <Layout>
        <Router />
      </Layout>
    </SidebarProvider>
  );
}

export default App;
