import axios from 'axios';

const API_URL = "http://localhost:8083/api";

export const fetchRestaurantOrders = async () => {
    const freshToken = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${freshToken}` }
    });
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const freshToken = localStorage.getItem("token");
    const response = await axios.patch(`${API_URL}/orders/status/${orderId}?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${freshToken}` }
    });
    return response.status === 200;
};

export const fetchDashboardStats = async () => {
    const freshToken = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/orders/dashboard-stats`, {
        headers: { Authorization: `Bearer ${freshToken}` }
    });
    return response.data;
};
