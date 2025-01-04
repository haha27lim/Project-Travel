import axios from "axios";

const API_URL = "/api/auth/";

axios.defaults.withCredentials = true;


const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + 'signup', {
    username,
    email,
    password,
  });
};

const login = (username: string, password: string) => {
  return axios
    .post(API_URL + 'signin', {
      username,
      password,
    })
    .then((response) => {
      if (response.data.username) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
  return axios.post(API_URL + 'signout').then((response) => {
    return response.data;
  });
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;