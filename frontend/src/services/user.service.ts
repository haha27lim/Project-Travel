import axios from "axios";
import authHeader from "./auth-header";
import { Trip } from "../types/trip.type";

const API_URL = "/api/";

class UserService {
  getPublicContent() {
    return axios.get(API_URL + "test/all");
  }

  getUserBoard() {
    return axios.get(API_URL + "test/user", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "test/mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "test/admin", { headers: authHeader() });
  }

  getAllUsers() {
    return axios.get(API_URL + "users", { headers: authHeader() });
  }

  updateUser(id: number, userData: any) {
    const headers = authHeader();
    console.log('Update user request:', {
      url: `${API_URL}users/${id}`,
      headers,
      data: userData
    });
    return axios.put(`${API_URL}users/${id}`, userData, { 
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });
  }

  deleteUser(id: number) {
    return axios.delete(`${API_URL}users/${id}`, { headers: authHeader() });
  }

  getAdminTrips() {
    return axios.get<Trip[]>(API_URL + "trips/admin", { headers: authHeader() });
  }

  getAdminTrip(id: number) {
    return axios.get<Trip>(`${API_URL}trips/admin/${id}`, { headers: authHeader() });
  }

  createAdminTrip(tripData: Omit<Trip, "id">) {
    return axios.post<Trip>(API_URL + "trips/admin", tripData, { headers: authHeader() });
  }

  updateAdminTrip(id: number, tripData: Partial<Trip>) {
    return axios.put<Trip>(`${API_URL}trips/admin/${id}`, tripData, { headers: authHeader() });
  }

  deleteAdminTrip(id: number) {
    return axios.delete(`${API_URL}trips/admin/${id}`, { headers: authHeader() });
  }
}

export default new UserService();