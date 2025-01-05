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
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/trips/:id" element={<TripDetails />} />
            <Route path="/places/saved" element={<SavedPlaces />} />
            <Route path="/ai-planner" element={<AITravelPlannerPage />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
