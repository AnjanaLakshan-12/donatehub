import api from "./axios";

export const registerUser = (user, orgData) => {
  console.log("Registering user:", user, "Organization data:", orgData);
  return api.post("/users/add", user, {
    params: orgData
  }).then(response => {
    console.log("Registration response:", response);
    return response;
  }).catch(error => {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  });
};

export const getAllUsers = (queryParams = "") =>
  api.get(`/users/getall/paginated${queryParams}`);

export const getUserById = (id) =>
  api.get(`/users/get/${id}`);

export const getUsersByDistrict = (district) =>
  api.get(`/users/get/district/${district}`);

export const updateUser = (id, user) =>
  api.put(`/users/update/${id}`, user);
