import axios from 'axios';

const API_URL = '/api/trips/';

axios.defaults.withCredentials = true;

const getUserTrips = () => {
  return axios.get(API_URL + 'user');
};

const getTripById = (id: string | number) => {
  if (!id || isNaN(Number(id))) {
    return Promise.reject(new Error('Invalid trip ID'));
  }
  return axios.get(API_URL + id);
};

const createTrip = (tripData: any) => {
  return axios.post(API_URL, tripData);
};

const updateTrip = (id: string | number, tripData: any) => {
  if (!id || isNaN(Number(id))) {
    return Promise.reject(new Error('Invalid trip ID'));
  }
  return axios.put(API_URL + id, tripData);
};

const deleteTrip = (id: string | number) => {
  if (!id || isNaN(Number(id))) {
    return Promise.reject(new Error('Invalid trip ID'));
  }
  return axios.delete(API_URL + id);
};

const shareTrip = (id: string | number, recipientEmail: string) => {
  if (!id || isNaN(Number(id))) {
    return Promise.reject(new Error('Invalid trip ID'));
  }
  return axios.post(`${API_URL}${id}/share`, null, {
    params: { recipientEmail }
  });
};

const TripService = {
  getUserTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  shareTrip
};

export default TripService; 