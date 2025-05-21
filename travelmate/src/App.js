import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import CreateTripPost from "./Pages/CreateTripPost";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/trip_post" element={<CreateTripPost />} />
      </Routes>
    </Router>
  );
}

export default App;
