import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.4:8000/user"; // ← replace with your IP

const login = async (credentials) => {
  const { data } = await axios.post(`${API_URL}/login/`, credentials);
  await AsyncStorage.setItem("token", data.token || "dummy"); // optional: change as per backend
  return data;
};

const register = async (userData) => {
  const { data } = await axios.post(`${API_URL}/register/`, userData);
  return data;
};

export default { login, register };
