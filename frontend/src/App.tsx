import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import BoardUser from "./components/BoardUser";
import BoardAdmin from "./components/BoardAdmin";
import { Header } from './components/Layout/Header';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './components/Dashboard';

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
            <Route
              path="/dashboard"
              element={
                  <Dashboard />
              }
            />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
