import axios from "axios";

const API_URL = 'http://localhost:8083/api/foods';

export const addFood = async (foodData, image) => {
    const formData = new FormData();
    formData.append('food', JSON.stringify(foodData));
    formData.append('file', image);
    const token = localStorage.getItem("token");

    try {
        await axios.post(API_URL, formData, { 
            headers: { 
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            } 
        });
    } catch (error) {
        console.log('Error', error);
        throw error;
    }
}

export const getFoodList = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(API_URL, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.log('Error fetching food list', error);
        throw error;
    }
}

export const deleteFood = async (foodId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(API_URL + "/" + foodId, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.status === 204;
    } catch (error) {
        console.log('Error while deleting the food.', error);
        throw error;
    }
}