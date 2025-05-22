import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import CreateTripPost from "./Components/CreateTripPost";
import TripFeedC from "./Pages/Trip-FeedC";
import MessagesPanel from "./Pages/MessagesPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/trip_post" element={<CreateTripPost />} />
        <Route path="/feed" element={<TripFeedC />} />
        <Route path="/messages" element={<MessagesPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
