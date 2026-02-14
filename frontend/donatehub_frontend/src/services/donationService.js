import api from "./axios";

export const addDonation = (donation) =>
  api.post("/donations/add", donation);

export const getAllDonations = (queryParams = "") =>
  api.get(`/donations/getall/paginated${queryParams}`);

export const getAvailableDonations = (queryParams = "") =>
  api.get(`/donations/getall/available/paginated${queryParams}`);

export const getDonationsByCategory = (category, queryParams = "") =>
  api.get(`/donations/category/${category}/paginated${queryParams}`);

export const getDonationsByUser = (username, queryParams = "") =>
  api.get(`/donations/username/${username}/paginated${queryParams}`);

export const getDonationsByUserId = (userId) =>
  api.get(`/donations/user/id/${userId}`);

export const searchDonations = (keyword) =>
  api.get(`/donations/search?keyword=${encodeURIComponent(keyword)}`);

export const updateDonation = (id, donation) =>
  api.put(`/donations/update/${id}`, donation);

export const deleteDonation = (id) => {
  // Ensure ID is clean (remove any special characters or suffixes)
  const cleanId = String(id).replace(/[^0-9]/g, '');
  console.log(`DonationService: Deleting donation ${cleanId} via DELETE /donations/delete/${cleanId}`);
  return api.delete(`/donations/delete/${cleanId}`, {
    transformResponse: [(data) => {
      // Handle both JSON and plain text responses
      try {
        return JSON.parse(data);
      } catch (e) {
        return data; // Return as-is if not JSON
      }
    }]
  });
};
