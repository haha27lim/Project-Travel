import axios from 'axios';
import { Place } from '../types/trip.type';

const API_URL = '/api/places/';

axios.defaults.withCredentials = true;

const getSavedPlaces = () => {
  return axios.get(API_URL + 'saved');
};

const savePlace = (placeData: Place) => {
  return axios.post(API_URL, placeData);
};

const updatePlace = (id: number, placeData: Place) => {
  return axios.put(API_URL + id, placeData);
};

const deletePlace = (id: number) => {
  return axios.delete(API_URL + id);
};

const PlaceService = {
  getSavedPlaces,
  savePlace,
  updatePlace,
  deletePlace,
};

export default PlaceService; 