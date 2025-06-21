import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from "../../contexts/AuthContext";


const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useAuth();

  useEffect(() => {
    // The cookie is set by the backend.
    // We just need to fetch the user data to update our app's state.
    const updateUserAndRedirect = async () => {
      await fetchUser(); // This will fetch user data using the new cookie
      navigate('/dashboard');
    };

    updateUserAndRedirect();
  }, [fetchUser, navigate]);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;