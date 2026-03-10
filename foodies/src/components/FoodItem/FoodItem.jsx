import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./FoodItem.css";

const FoodItem = ({ name, description, id, imageUrl, price, restaurantName }) => {
  const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-4 d-flex justify-content-center">
      <div className="card food-item-card premium-card hover-shadow h-100 w-100">
        <div className="position-relative overflow-hidden">
             <Link to={`/food/${id}`}>
               <img
                 src={imageUrl}
                 className="card-img-top food-item-image"
                 alt={name}
               />
             </Link>
             <div className="price-tag">&#8377;{price}</div>
        </div>
        
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title fw-bold mb-0 text-truncate" style={{maxWidth: '70%'}}>{name}</h5>
            <div className="rating-pill">
              <i className="bi bi-star-fill text-warning me-1"></i>
              <span>4.5</span>
            </div>
          </div>
          
          <p className="card-text text-muted small lines-2 mb-3">{description}</p>
          
          <div className="d-flex align-items-center text-primary fw-medium small mb-3">
            <i className="bi bi-shop me-2"></i>
            <span className="text-truncate">{restaurantName || "Premium Kitchen"}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-auto">
             <Link className="btn-view" to={`/food/${id}`}>
              Details
            </Link>
            
            {quantities && quantities[id] > 0 ? (
              <div className="cart-controls">
                <button
                  className="btn-circle btn-minus"
                  onClick={() => decreaseQty(id)}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <span className="qty-count">{quantities[id]}</span>
                <button
                  className="btn-circle btn-plus"
                  onClick={() => increaseQty(id)}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            ) : (
              <button
                className="btn-add-main"
                onClick={() => increaseQty(id)}
              >
                <i className="bi bi-plus-lg me-1"></i> Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
