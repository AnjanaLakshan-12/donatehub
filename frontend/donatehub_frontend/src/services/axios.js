import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true // Essential for session cookies - Spring Security will handle authentication via JSESSIONID
});

// No JWT token needed - using session-based authentication
// The session cookie (JSESSIONID) is automatically sent with each request due to withCredentials: true

export default api;