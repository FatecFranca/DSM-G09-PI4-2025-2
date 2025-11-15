import axios from "axios";

//const local = "http://192.168.100.7:5000/api"; //  IP casa
const local = "http://20.80.105.137:5000/api";  // IP VM Azure

//const prod = "https://neat-cars-spend.loca.lt";

const api = axios.create({
  baseURL: __DEV__ ? local : prod,
  timeout: 10000,
});

export default api;
