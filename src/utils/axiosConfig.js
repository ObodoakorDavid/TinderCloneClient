import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
});

axiosInstance.defaults.headers.common.Authorization = null;

export default axiosInstance;
