import axios from "axios";

// const API_URL = "http://localhost:8083/api";
const API_URL = `${process.env.REACT_APP_API_URL}/api`;
const token = localStorage.getItem("token");

const authHeader = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export const addFood = async (data, image) => {
  const freshToken = localStorage.getItem("token");
  const formData = new FormData();

  // The backend expects a "food" part as a JSON string
  const foodData = {
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
  };

  formData.append("food", JSON.stringify(foodData));
  formData.append("file", image);

  const response = await axios.post(`${API_URL}/foods`, formData, {
    headers: {
      Authorization: `Bearer ${freshToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getFoodList = async () => {
  const freshToken = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/foods`, {
    headers: { Authorization: `Bearer ${freshToken}` },
  });
  return response.data;
};

export const readFood = async (id) => {
  const freshToken = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/foods/${id}`, {
    headers: { Authorization: `Bearer ${freshToken}` },
  });
  return response.data;
};

export const deleteFood = async (id) => {
  const freshToken = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/foods/${id}`, {
    headers: { Authorization: `Bearer ${freshToken}` },
  });
  return response.status === 204 || response.status === 200;
};

export const updateFood = async (id, data, image) => {
  const freshToken = localStorage.getItem("token");
  const formData = new FormData();

  const foodData = {
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
  };

  formData.append("food", JSON.stringify(foodData));
  if (image) {
    formData.append("file", image);
  }

  const response = await axios.put(`${API_URL}/foods/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${freshToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
