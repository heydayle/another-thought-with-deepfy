import { Routes, Route } from "react-router";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import { DashboardPage } from "@/pages/Dashboard";
import PersonalGoalsPage from "@/pages/PersonalGoalsPage";
import HealthInsightsPage from "@/pages/HealthInsightsPage";
import { DefaultLayout } from "./components/layouts/default";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/personal-goals" element={<PersonalGoalsPage />} />
        <Route path="/health-insights" element={<HealthInsightsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
