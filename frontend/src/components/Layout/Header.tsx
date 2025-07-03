import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Compass, LogIn, UserPlus } from "lucide-react";
import '../../styles/components/Header.css';

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, showAdminBoard } = useAuth();


    const handleLogout = async () => {
        try {
            await logout();
        } catch (e: any) {
            if (e?.response?.status !== 403) {
                console.error("Logout failed:", e);
            }
        }
        const protectedRoutes = ['/dashboard', '/profile', '/user', '/admin', '/places/saved', '/trips', '/ai-planner'];
        if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
            navigate('/login');
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-content">
                    <Link to="/" className="logo-link">
                        <div className="logo-container">
                            <Compass className="logo-icon" />
                        </div>
                        <div>
                            <h1 className="app-title">JourneyBloom</h1>
                        </div>
                    </Link>

                    <div className="nav-buttons">
                        <Link to={"/home"} className="nav-link">
                            Home
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="nav-link">Trip Planner</Link>
                                <Link to="/ai-planner" className="nav-link">
                                    AI Planner
                                </Link>
                                <Link to={"/user"} className="nav-link">User</Link>
                                <Link to="/profile" className="nav-link">Profile</Link>
                                <button onClick={handleLogout} className="logout-button">
                                    <LogIn className="button-icon" />
                                    Logout
                                </button>
                            </>
                        ) :
                            (
                                <>
                                    <Link to="/login" className="login-button">
                                        <LogIn className="button-icon" />
                                        Login
                                    </Link>
                                    <Link to="/register" className="signup-button">
                                        <UserPlus className="button-icon" />
                                        Sign Up
                                    </Link>
                                </>
                            )
                        }


                        {showAdminBoard && (
                            <Link to={"/admin"} className="nav-link">
                                Admin Board
                            </Link>
                        )}

                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 