import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DonorDashboard from "./pages/Donor/DonorDashboard";
import EditProfile from "./pages/Donor/EditProfile";
import NewListing from "./pages/Donor/NewListing";
import EditListing from './pages/Donor/EditListing';
import RecipientDashboard from "./pages/Recipient/RecipientDashboard";
import RecipientProfile from "./pages/Recipient/RecipientProfile";
import RecipientReservations from "./pages/Recipient/RecipientReservations";
import Message from "./pages/Message";
import useAuthStore from "./store/authStore";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import { Children, useEffect, ReactNode } from "react";

// Protected routes - if the user is not authenticated, they will be redirected to the login page
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  // check the auth state
  const { isCheckingAuth, checkAuth } = useAuthStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Landing />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />

          {/* Protected donor routes */}
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/newlisting"
            element={
              <ProtectedRoute>
                <NewListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editlistings/:id"
            element={
              <ProtectedRoute>
                <EditListing />
              </ProtectedRoute>
            }
          />

          {/* Protected recipient routes */}
          <Route
            path="/recipient/dashboard"
            element={
              <ProtectedRoute>
                <RecipientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient/profile"
            element={
              <ProtectedRoute>
                <RecipientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient/reservations"
            element={
              <ProtectedRoute>
                <RecipientReservations />
              </ProtectedRoute>
            }
          />

          {/* Protected message route */}
          <Route
            path="/message/:receiverId"
            element={
              <ProtectedRoute>
                <Message />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
