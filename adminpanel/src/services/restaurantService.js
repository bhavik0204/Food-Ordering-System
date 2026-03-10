import axios from "axios";

const API_URL = "http://localhost:8083/api/admin/restaurants";

export const fetchAllRestaurants = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurants', error);
        throw error;
    }
}
