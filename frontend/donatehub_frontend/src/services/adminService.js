import api from "./axios";

export const approveUser = (id) =>
  api.put(`/admin/approve/${id}`);

export const changeRole = (id, role) =>
  api.put(`/admin/changeroll/${id}`, null, {
    params: { role }
  });

export const deleteUser = (id) => {
  // Ensure ID is clean (remove any special characters or suffixes)
  const cleanId = String(id).replace(/[^0-9]/g, '');
  console.log(`AdminService: Deleting user ${cleanId} via DELETE /admin/delete/${cleanId}`);
  return api.delete(`/admin/delete/${cleanId}`, {
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
