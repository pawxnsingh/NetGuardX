import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/landing";
import { Dashboard } from "./pages/dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;
