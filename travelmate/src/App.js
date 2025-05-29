// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./Components/PrivateRoute";
import RoleProtectedRoute from "./Components/RoleProtectedRoute";

import LandingPage from "./Pages/LandingPage";
import CreateTripPost from "./Components/CreateTripPost";
import TripFeedC from "./Pages/Trip-FeedC";
import MessagesPanel from "./Pages/MessagesPanel";
import ProfilePage from "./Pages/ProfilePage";

import UserPage from "./Dashboard/UserPage";
import TripsPage from "./Dashboard/TripsPage";
import Statistics from "./Dashboard/Statistics";
import CountryForm from "./Dashboard/CountryForm";
import DashboardWrapper from "./Dashboard/DashboardWrapper";

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

          {/* ✅ Admin-only routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <RoleProtectedRoute allowedRoleId={1}>
                  <DashboardWrapper />
                </RoleProtectedRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<Statistics />} />
            <Route path="users" element={<UserPage />} />
            <Route path="trips" element={<TripsPage />} />
            <Route path="country" element={<CountryForm />} />
            <Route path="statistics" element={<Statistics />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
