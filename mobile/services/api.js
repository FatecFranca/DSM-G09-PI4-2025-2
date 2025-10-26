import axios from "axios";

const local = "http://192.168.100.7:5000/api"; // 👉 seu IP local
const prod = "https://ouviot-api.onrender.com/api";

const api = axios.create({
  baseURL: __DEV__ ? local : prod,
  timeout: 10000,
});

export default api;
