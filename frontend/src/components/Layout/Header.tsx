import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthService from "../../services/auth.service";
import { Compass, LogIn, UserPlus } from "lucide-react";
import '../../styles/components/Header.css';
import { useEffect } from "react";
import EventBus from "../../common/EventBus";

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, showAdminBoard, setCurrentUser, setShowAdminBoard } = useAuth();

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
            setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }

        EventBus.on("logout", logOut);

        return () => {
            EventBus.remove("logout", logOut);
        };
    }, []);

    const logOut = () => {
        AuthService.logout();
        setShowAdminBoard(false);
        setCurrentUser(undefined);
        navigate('/');
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

                        {showAdminBoard && (
                            <Link to={"/admin"} className="nav-link">
                                Admin Board
                            </Link>
                        )}

                        {currentUser ? (
                            <>
                                <Link to="/dashboard" className="nav-link">Trip Planner</Link>
                                <Link to={"/user"} className="nav-link">User</Link>
                                <Link to="/profile" className="nav-link">Profile</Link>
                                <button onClick={logOut} className="logout-button">
                                    <LogIn className="button-icon" />
                                    Logout
                                </button>
                            </>
                        ) : (
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
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};