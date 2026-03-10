import React, { useEffect, useState } from "react";
import { fetchRestaurantOrders, updateOrderStatus } from "../../services/orderService";
import { toast } from "react-toastify";

const Orders = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'to-prepare', 'delivered'

  const fetchOrders = async () => {
    try {
      const response = await fetchRestaurantOrders();
      setData(response);
    } catch (error) {
      toast.error("Unable to display the orders.");
    }
  };

  const updateStatus = async (event, orderId) => {
    try {
      const success = await updateOrderStatus(orderId, event.target.value);
      if (success) {
        toast.success("Status updated");
        await fetchOrders();
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Calculate items to prepare (for Kitchen View)
  // Only for "Pending" or "Food Preparing" orders that are "Paid"
  const getKitchenSummary = () => {
    const summary = {};
    data.filter(order => 
      (order.orderStatus === "Pending" || order.orderStatus === "Food Preparing") && 
      order.paymentStatus === "Paid"
    ).forEach(order => {
      order.orderedItems?.forEach(item => {
        if (summary[item.foodName]) {
          summary[item.foodName] += item.quantity;
        } else {
          summary[item.foodName] = item.quantity;
        }
      });
    });
    return Object.entries(summary);
  };

  const kitchenItems = getKitchenSummary();

  const filteredOrders = data.filter(order => {
    if (activeTab === 'to-prepare') return order.orderStatus === "Pending" || order.orderStatus === "Food Preparing";
    if (activeTab === 'delivered') return order.orderStatus === "Delivered" || order.orderStatus === "Cancelled";
    return true;
  });

  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Order Management</h2>
        <div className="btn-group shadow-sm">
          <button className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('all')}>All Orders</button>
          <button className={`btn btn-sm ${activeTab === 'to-prepare' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('to-prepare')}>To Prepare</button>
          <button className={`btn btn-sm ${activeTab === 'delivered' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('delivered')}>Past Orders</button>
        </div>
      </div>

      {/* Kitchen Summary Section */}
      {kitchenItems.length > 0 && activeTab !== 'delivered' && (
        <div className="card border-0 shadow-sm bg-primary bg-gradient text-white mb-4">
          <div className="card-body p-4">
            <h5 className="mb-3"><i className="bi bi-fire me-2"></i>Kitchen List (Items to Prepare)</h5>
            <div className="d-flex flex-wrap gap-3">
              {kitchenItems.map(([name, qty], i) => (
                <div key={i} className="bg-white text-dark rounded-pill px-3 py-2 shadow-sm d-flex align-items-center">
                  <span className="badge bg-primary rounded-circle me-2 d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px'}}>{qty}</span>
                  <span className="fw-bold">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="row g-3">
        {filteredOrders.length === 0 ? <div className="text-center py-5 bg-white rounded-3 shadow-sm"><h4>No orders found.</h4></div> : 
          filteredOrders.sort((a,b) => b.id - a.id).map((order, index) => (
          <div key={index} className="col-12">
            <div className={`card shadow-sm border-0 mb-3 transition ${order.orderStatus === 'Pending' ? 'border-start border-danger border-4' : ''}`}>
              <div className="card-body">
                <div className="row align-items-start">
                  <div className="col-md-1 text-center">
                    <div className={`rounded p-2 text-center ${order.orderStatus === 'Delivered' ? 'bg-success' : 'bg-primary'} text-white`}>
                      <i className={`bi ${order.orderStatus === 'Delivered' ? 'bi-check2-circle' : 'bi-box-seam'} fs-4`}></i>
                    </div>
                    <div className="small mt-1 fw-bold text-muted">ID: #{order.id}</div>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-muted fw-bold small text-uppercase">Items</h6>
                    <ul className="list-unstyled small mb-0">
                      {order.orderedItems?.map((item, idx) => (
                        <li key={idx} className="mb-1"><span className="badge bg-light text-primary border me-2">{item.quantity}</span> {item.foodName}</li>
                      ))}
                    </ul>
                    <div className="mt-2 text-dark h5 mb-0">₹{order.amount.toFixed(2)}</div>
                  </div>
                  <div className="col-md-3 border-start">
                    <h6 className="text-muted fw-bold small text-uppercase">Customer & Address</h6>
                    <div className="small">
                       <div className="fw-bold text-primary">{order.email}</div>
                       <div className="text-muted"><i className="bi bi-telephone me-1"></i>{order.phoneNumber}</div>
                       <div className="mt-2 p-2 bg-light rounded text-dark border-start border-dark" style={{fontSize: '0.8rem'}}>
                         <i className="bi bi-geo-alt-fill me-1"></i>{order.userAddress}
                       </div>
                       {order.specialInstructions && (
                         <div className="mt-2 p-2 bg-warning bg-opacity-10 border-start border-warning border-3 small rounded">
                           <strong><i className="bi bi-info-circle me-1"></i>Note:</strong> {order.specialInstructions}
                         </div>
                       )}
                    </div>
                  </div>
                  <div className="col-md-2 border-start text-center">
                    <h6 className="text-muted fw-bold small text-uppercase">Payment</h6>
                    <span className={`badge rounded-pill ${order.paymentStatus === 'Paid' || order.paymentStatus === 'Success' ? 'bg-success' : 'bg-danger'} px-3 py-2`}>
                      {order.paymentStatus === 'Success' ? 'Paid' : order.paymentStatus}
                    </span>
                  </div>
                  <div className="col-md-3 border-start">
                    <h6 className="text-muted fw-bold small text-uppercase">Update Status</h6>
                    <select
                      className={`form-select form-select-sm fw-bold ${
                        order.orderStatus === 'Pending' ? 'text-danger' : 
                        order.orderStatus === 'Food Preparing' ? 'text-warning' : 
                        order.orderStatus === 'Delivered' ? 'text-success' : ''
                      }`}
                      onChange={(event) => updateStatus(event, order.id)}
                      value={order.orderStatus}
                    >
                      <option value="Pending">🔴 Pending</option>
                      <option value="Food Preparing">🟠 Food Preparing</option>
                      <option value="Out for delivery">🔵 Out for delivery</option>
                      <option value="Delivered">🟢 Delivered</option>
                      <option value="Cancelled">⚫ Cancelled</option>
                    </select>
                    <div className="small text-muted mt-2">
                       <i className="bi bi-clock me-1"></i>Last updated: Just now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
