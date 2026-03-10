import React, { useEffect, useState } from 'react'
import { fetchDashboardStats } from '../../services/orderService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error("Error loading dashboard stats");
      }
    };
    loadStats();
  }, []);

  return (
    <div className="mt-2">
      <h1 className="h2 mb-4">Restaurant Dashboard</h1>
      <div className="row g-4 mt-2">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-top border-primary border-4">
            <div className="card-body p-4 text-center">
              <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex p-3 mb-3">
                <i className="bi bi-cart-check text-primary fs-3"></i>
              </div>
              <h5 className="card-title text-muted small text-uppercase fw-bold">Total Orders</h5>
              <p className="card-text fs-2 fw-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-top border-success border-4">
            <div className="card-body p-4 text-center">
              <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex p-3 mb-3">
                <i className="bi bi-wallet2 text-success fs-3"></i>
              </div>
              <h5 className="card-title text-muted small text-uppercase fw-bold">Total Revenue</h5>
              <p className="card-text fs-2 fw-bold">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-top border-warning border-4">
            <div className="card-body p-4 text-center">
              <div className="rounded-circle bg-warning bg-opacity-10 d-inline-flex p-3 mb-3">
                <i className="bi bi-graph-up text-warning fs-3"></i>
              </div>
              <h5 className="card-title text-muted small text-uppercase fw-bold">Avg Order Value</h5>
              <p className="card-text fs-2 fw-bold">₹{stats.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
