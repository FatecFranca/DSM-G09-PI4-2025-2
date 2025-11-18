import axios from "axios";

const local = "http://192.168.100.7:5000/"; //  IP casa

const prod = "http://20.80.105.137:5000/";  // IP VM Azure

const api = axios.create({
  baseURL: __DEV__ ? local : prod,
  timeout: 10000,
});

export default api;
