import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/antd.css";

import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import BoardUser from "./components/BoardUser";
import BoardAdmin from "./components/BoardAdmin";
import { Header } from './components/Layout/Header';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './components/Dashboard';
import { TripDetails } from './components/TripDetails';
import SavedPlaces from "./components/SavedPlaces";
import AITravelPlannerPage from "./components/AI/AITravelPlannerPage";
import { AuthGuard } from './components/Auth.Guard';
import NotFound from './components/NotFound';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Chatbot from './components/AI/Chatbot';
import { UserManagement } from './components/admin/UserManagement';
import { TripManagement } from './components/admin/TripManagement';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/profile" element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          } />
          <Route path="/user" element={
            <AuthGuard>
              <BoardUser />
            </AuthGuard>
          } />
          <Route path="/admin" element={
            <AuthGuard requireAdmin={true}>
              <BoardAdmin />
            </AuthGuard>
          } />
          <Route path="/admin/users" element={
            <AuthGuard requireAdmin={true}>
              <UserManagement />
            </AuthGuard>
          } />
          <Route path="/admin/trips" element={
            <AuthGuard requireAdmin={true}>
              <TripManagement />
            </AuthGuard>
          } />
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/trips/:id" element={
            <AuthGuard>
              <TripDetails />
            </AuthGuard>
          } />
          <Route path="/places/saved" element={
            <AuthGuard>
              <SavedPlaces />
            </AuthGuard>
          } />
          <Route path="/ai-planner" element={
            <AuthGuard>
              <AITravelPlannerPage />
            </AuthGuard>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Chatbot />
        
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
