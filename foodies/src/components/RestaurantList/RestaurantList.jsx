import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const { url } = useContext(StoreContext);

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${url}/api/restaurants`);
                setRestaurants(response.data);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, [url]);

    if (loading) {
        return (
            <div className="container mt-5 py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 fade-in-up" id="restaurants-section">
            <div className="d-flex align-items-center mb-4">
                <i className="bi bi-shop text-primary fs-2 me-3"></i>
                <h2 className="m-0 fw-bold">Explore Restaurants</h2>
            </div>
            
            {restaurants.length > 0 ? (
                <div className="row g-4">
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="col-lg-4 col-md-4 col-sm-6">
                            <Link to={`/restaurant/${restaurant.id}`} className="text-decoration-none">
                                <div className="card premium-card hover-shadow h-100">
                                    <div className="card-body p-4 text-center">
                                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" style={{width: '70px', height: '70px'}}>
                                            <i className="bi bi-shop text-primary fs-2"></i>
                                        </div>
                                        <h4 className="card-title fw-bold text-dark mb-2">{restaurant.name}</h4>
                                        <p className="card-text text-muted small mb-4">
                                            <i className="bi bi-geo-alt-fill me-1 text-danger"></i>
                                            {"Free Delivery"}
                                        </p>
                                        <div className="btn btn-primary rounded-pill px-4 py-2 fw-bold small">
                                            View Menu
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5 bg-white shadow-sm rounded-4">
                    <i className="bi bi-shop-window display-1 text-muted mb-3 d-block"></i>
                    <h3>No restaurants available.</h3>
                    <p className="text-muted">We're still onboarding partners. Check back soon!</p>
                </div>
            )}
        </div>
    );
};

export default RestaurantList;
