import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import './RestaurantMenu.css';

const RestaurantMenu = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const { url } = useContext(StoreContext);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const res = await axios.get(`${url}/api/restaurants/${id}`);
                console.log("Fetched Restaurant:", res.data);
                setRestaurant(res.data);
                
                const foodsRes = await axios.get(`${url}/api/foods/restaurant/${id}`);
                console.log("Fetched Foods for Restaurant ID:", id, foodsRes.data);
                setFoods(foodsRes.data);
            } catch (error) {
                console.error("Error fetching restaurant menu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurantDetails();
    }, [id, url]);

    if (loading) {
        return (
            <div className="container text-center py-5 vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-grow text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                    <span className="visually-hidden">Loading menu...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 fade-in-up">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{restaurant?.name}</li>
                </ol>
            </nav>

            <div className="restaurant-hero">
                <div className="position-relative z-1">
                    <div className="glass-badge">
                        <i className="bi bi-patch-check-fill text-info"></i>
                        <span>Premium Restaurant</span>
                    </div>
                    <h1 className="display-3 fw-bold mb-3">{restaurant?.name}</h1>
                    <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                        <div className="stat-card">
                            <span className="stat-value">4.8 <i className="bi bi-star-fill text-warning ms-1"></i></span>
                            <span className="stat-label">Rating</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">25-35</span>
                            <span className="stat-label">Min Time</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">Free</span>
                            <span className="stat-label">Delivery</span>
                        </div>
                    </div>
                    <div className="mt-4 opacity-75">
                         <i className="bi bi-geo-alt-fill me-2"></i>
                         {restaurant?.location || "Main Branch, Downtown"}
                    </div>
                </div>
            </div>

            <div className="mb-5">
                <h2 className="menu-section-title">Explore Our Menu</h2>
                <div className="row g-4">
                    {foods.length > 0 ? (
                        foods.map((food) => (
                            <FoodItem 
                                key={food.id}
                                name={food.name} 
                                description={food.description}
                                id={food.id}
                                imageUrl={food.imageUrl}
                                price={food.price}
                                restaurantName={restaurant?.name} 
                            />
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <div className="p-5 bg-white rounded-4 shadow-sm">
                                <i className="bi bi-journal-x display-1 text-muted mb-3 d-block"></i>
                                <h3>No dishes available yet.</h3>
                                <p className="text-muted">This restaurant hasn't added any food items to their menu yet.</p>
                                <Link to="/" className="btn btn-primary rounded-pill px-5 py-3 mt-3 fw-bold">Browse other restaurants</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantMenu;
