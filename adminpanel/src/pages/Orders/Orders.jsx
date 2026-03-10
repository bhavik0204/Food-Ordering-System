import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { fetchAllOrders, updateOrderStatus } from "../../services/orderService";
import { toast } from "react-toastify";

const Orders = () => {
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetchAllOrders();
      setData(response);
    } catch (error) {
      toast.error("Unable to display the orders. Please try again.");
    }
  };

  const updateStatus = async (event, orderId) => {
    const success = await updateOrderStatus(orderId, event.target.value);
    if (success) await fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container-fluid">
      <div className="py-4">
        <h2 className="mb-4">Orders Management</h2>
        <div className="row g-3">
          {data.map((order, index) => {
            return (
              <div key={index} className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="row align-items-center">
                      {/* Order Icon */}
                      <div className="col-auto">
                        <img src={assets.parcel} alt="" height={48} width={48} />
                      </div>

                      {/* Order Items */}
                      <div className="col-md-3">
                        <h6 className="mb-1 text-primary">Order Items</h6>
                        <div className="small">
                          {order.orderedItems?.map((item, idx) => (
                            <div key={idx}>
                              • {item.name} x {item.quantity}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2">
                          <strong>Total: &#8377;{order.amount.toFixed(2)}</strong>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="col-md-3">
                        <h6 className="mb-1 text-success">Customer Details</h6>
                        <div className="small">
                          <div><i className="bi bi-envelope me-1"></i>{order.email}</div>
                          <div><i className="bi bi-telephone me-1"></i>{order.phoneNumber}</div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="col-md-3">
                        <h6 className="mb-1 text-info">Delivery Address</h6>
                        <div className="small">{order.userAddress}</div>
                      </div>

                      {/* Order Status */}
                      <div className="col-md-2">
                        <h6 className="mb-1">Status</h6>
                        <select
                          className="form-select form-select-sm"
                          onChange={(event) => updateStatus(event, order.id)}
                          value={order.orderStatus}
                        >
                          <option value="Food Preparing">Food Preparing</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
