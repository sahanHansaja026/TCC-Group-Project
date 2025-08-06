import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL  from '../../config/ipconfig';

const API_URL = `${API_BASE_URL}/user`; // ← replace with your IP


const register = async (userData) => {
  const { data } = await axios.post(`${API_URL}/register/`, userData);
  return data;
};

const login = async (credentials) => {
  const { data } = await axios.post(`${API_URL}/login/`, credentials);
  await AsyncStorage.setItem("token", data.token); // store real JWT token
  return data;
};

const getUserData = async () => {
  const token = await AsyncStorage.getItem("token");
  const { data } = await axios.get(`${API_URL}/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export default {
  login,
  register,
  getUserData,
};
