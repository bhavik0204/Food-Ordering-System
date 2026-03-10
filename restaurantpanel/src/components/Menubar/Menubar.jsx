import React, { useEffect, useState, useRef } from 'react';
import { fetchRestaurantOrders } from '../../services/orderService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Menubar = ({ toggleSidebar }) => {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const [orderCount, setOrderCount] = useState(0);
  const prevOrderCount = useRef(0);

  const fetchOrders = async () => {
    try {
      const orders = await fetchRestaurantOrders();
      // Filter for orders that are paid but still pending to be processed by restaurant
      const pendingOrders = orders.filter(order => order.orderStatus === "Pending" && order.paymentStatus === "Paid");
      const currentCount = pendingOrders.length;
      

      setOrderCount(currentCount);
      prevOrderCount.current = currentCount;
    } catch (error) {
      console.error("Error polling orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(); // Initial fetch
    const interval = setInterval(fetchOrders, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-white bg-white border-bottom shadow-sm py-3">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light shadow-sm border rounded-circle" id="sidebarToggle" onClick={toggleSidebar}>
            <i className='bi bi-list px-1'></i>
          </button>
          <Link to="/orders" className="btn btn-light shadow-sm border rounded-circle position-relative">
            <i className="bi bi-bell-fill text-primary"></i>
            {orderCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.65rem'}}>
                {orderCount}
                <span className="visually-hidden">unread orders</span>
              </span>
            )}
          </Link>
        </div>
        <div className="d-flex align-items-center gap-4">
          <div className="text-end me-1 d-none d-md-block">
            <div className="small fw-bold text-dark" style={{fontSize: '0.9rem'}}>{email}</div>
            <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 rounded-pill" style={{fontSize: '0.75rem', fontWeight: '600'}}>
              <i className="bi bi-person-badge-fill me-1"></i>Owner
            </div>
          </div>
          <button className="btn btn-outline-danger btn-sm rounded-pill px-3 shadow-sm transition-all" onClick={logout} style={{fontWeight: '500'}}>
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Menubar;
