import { Routes, Route } from "react-router";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import { DashboardPage } from "@/pages/Dashboard";
import { DefaultLayout } from "./components/layouts/default";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
