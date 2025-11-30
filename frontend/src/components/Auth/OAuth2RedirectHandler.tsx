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
        const hash = window.location.hash;
        const tokenMatch = hash.match(/token=([^&]+)/);

        if (tokenMatch && tokenMatch[1]) {
          const token = tokenMatch[1];
          console.log('Token from OAuth2 redirect:', token.substring(0, 20) + '...');

          const userWithToken = {
            token: token
          };
          localStorage.setItem('user', JSON.stringify(userWithToken));

          const response = await api.get('/auth/user');
          const userData = response.data;

          const fullUserData = {
            ...userData,
            token: token
          };

          localStorage.setItem('user', JSON.stringify(fullUserData));
          setCurrentUser(fullUserData);


          if (userData.roles && userData.roles.includes("ROLE_ADMIN")) {
            setShowAdminBoard(true);
          } else {
            setShowAdminBoard(false);
          }

          navigate('/dashboard');
        } else {
          // No token in URL, try to fetch user info directly (cookie-based auth)
          console.log('No token in URL, attempting cookie-based auth...');
          const response = await api.get('/auth/user');
          const userData = response.data;

          const userWithToken = {
            ...userData,
            token: 'oauth2-cookie'
          };

          localStorage.setItem('user', JSON.stringify(userWithToken));
          setCurrentUser(userWithToken);

          if (userData.roles && userData.roles.includes("ROLE_ADMIN")) {
            setShowAdminBoard(true);
          } else {
            setShowAdminBoard(false);
          }

          navigate('/dashboard');
        }


      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          console.error('OAuth2 redirect error:', (err as any).response?.data || (err as any).message || err);
        } else {
          console.error('OAuth2 redirect error:', err);
        }

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