import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true
});

// No JWT token needed - using session-based authentication

export default api;