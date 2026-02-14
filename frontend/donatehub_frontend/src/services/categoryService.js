import api from "./axios";

export const addCategory = (category) =>
  api.post("/add/categories", category);

export const getCategories = () =>
  api.get("/categories");

export const updateCategory = (id, category) => {
  const cleanId = String(id).replace(/[^0-9]/g, '');
  console.log(`CategoryService: Updating category ${cleanId}`);
  return api.put(`/update/category/${cleanId}`, category, {
    transformResponse: [(data) => {
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    }]
  });
};

export const deleteCategory = (id) => {
  const cleanId = String(id).replace(/[^0-9]/g, '');
  console.log(`CategoryService: Deleting category ${cleanId}`);
  return api.delete(`/delete/category/${cleanId}`, {
    transformResponse: [(data) => {
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    }]
  });
};