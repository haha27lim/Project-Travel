import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/userapi";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setShowAdminBoard } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      try {
        const response = await api.get('/auth/user');
        const userData = response.data;
        
        setCurrentUser(userData);
        

        if (userData.roles && userData.roles.includes("ROLE_ADMIN")) {
          setShowAdminBoard(true);
        } else {
          setShowAdminBoard(false);
        }
        
        navigate('/dashboard');
      } catch (error) {
        console.error('OAuth2 redirect error:', error);
        setError('Authentication failed. Please try again.');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleOAuth2Redirect();
  }, [navigate, setCurrentUser, setShowAdminBoard]);

  if (loading) {
    return <div>Completing authentication...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;