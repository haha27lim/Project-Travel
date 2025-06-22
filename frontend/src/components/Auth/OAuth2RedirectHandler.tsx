import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";


const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  useEffect(() => {

    const updateUserAndRedirect = async () => {
      await fetchUser();
      navigate('/dashboard');
    };

    updateUserAndRedirect();
  }, [fetchUser, navigate]);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;