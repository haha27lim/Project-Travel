import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import { Camera, Mail, Shield, User as UserIcon } from "lucide-react";
import '../styles/components/Profile.css';

const Profile: React.FC = () => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [userReady, setUserReady] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser & { accessToken: string }>({
    accessToken: "",
    id: "",
    username: "",
    email: "",
    roles: [],
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      setRedirect("/home");
    } else {
      setCurrentUser(currentUser);
      setUserReady(true);
    }
  }, []);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="profile-container">
      {userReady ? (
        <div className="profile-content">
          <div className="profile-header">
            <div className="avatar-container">
              <div className="avatar">
                {currentUser.username?.charAt(0).toUpperCase()}
                <button className="avatar-upload-btn">
                  <Camera className="camera-icon" />
                </button>
              </div>
            </div>
            <h2 className="profile-name">{currentUser.username}</h2>
            <p className="profile-email">{currentUser.email}</p>
          </div>

          <div className="profile-details">
            <div className="detail-card">
              <div className="detail-icon">
                <UserIcon className="icon" />
              </div>
              <div className="detail-info">
                <h3>Username</h3>
                <p>{currentUser.username}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <Mail className="icon" />
              </div>
              <div className="detail-info">
                <h3>Email</h3>
                <p>{currentUser.email}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <Shield className="icon" />
              </div>
              <div className="detail-info">
                <h3>Roles</h3>
                <div className="roles-container">
                  {currentUser.roles?.map((role, index) => (
                    <span key={index} className="role-badge">
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
