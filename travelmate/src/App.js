import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./Components/PrivateRoute";
import LandingPage from "./Pages/LandingPage";
import CreateTripPost from "./Components/CreateTripPost";
import TripFeedC from "./Pages/Trip-FeedC";
import MessagesPanel from "./Pages/MessagesPanel";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/feed"
            element={
              <PrivateRoute>
                <TripFeedC />
              </PrivateRoute>
            }
          />
          <Route
            path="/trip_post"
            element={
              <PrivateRoute>
                <CreateTripPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <MessagesPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
