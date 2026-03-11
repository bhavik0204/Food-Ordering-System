import axios from "axios";

// const API_URL = "http://localhost:8083/api/orders";
const API_URL = `${process.env.REACT_APP_API_URL}/api/orders`;

export const fetchAllOrders = async () => {
  const freshToken = localStorage.getItem("token");
  try {
    const response = await axios.get(API_URL + "/all", {
      headers: { Authorization: `Bearer ${freshToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error occured while fetching the orders", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  const freshToken = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${API_URL}/status/${orderId}?status=${status}`,
      {},
      {
        headers: { Authorization: `Bearer ${freshToken}` },
      },
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error occured while updating the status", error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  const freshToken = localStorage.getItem("token");
  try {
    const response = await axios.get(API_URL + "/dashboard-stats", {
      headers: { Authorization: `Bearer ${freshToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error occurred while fetching dashboard stats", error);
    throw error;
  }
};
