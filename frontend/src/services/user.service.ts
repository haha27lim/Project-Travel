import axios from 'axios';

const API_URL = '/api/test/';

axios.defaults.withCredentials = true;


const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", {
    withCredentials: true
  });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", {
    withCredentials: true
  });
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getAdminBoard,
}

export default UserService;