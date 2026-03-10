import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard/Dashboard'
import AddFood from './pages/AddFood/AddFood'
import EditFood from './pages/AddFood/EditFood'
import ListFood from './pages/ListFood/ListFood'
import Orders from './pages/Orders/Orders'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Sidebar from './components/Sidebar/Sidebar'
import Menubar from './components/Menubar/Menubar'
import './pages/Login/Auth.css'

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlRole = urlParams.get('role');
    if (urlToken && urlRole) {
      localStorage.setItem("token", urlToken);
      localStorage.setItem("role", urlRole);
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    }
  }, []);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  console.log("RestaurantPanel Auth Check:", { hasToken: !!token, role });

  // Handle unauthenticated or non-owner users
  if (!token || (role !== "RESTAURANT_OWNER" && role !== "ADMIN")) {
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={
            token && (role !== "RESTAURANT_OWNER" && role !== "ADMIN") ? (
              <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="card shadow p-4 border-0 rounded-4 text-center" style={{maxWidth: '400px'}}>
                  <i className="bi bi-exclamation-triangle-fill text-warning display-4 mb-3"></i>
                  <h3 className="fw-bold">Access Denied</h3>
                  <p className="text-muted">
                    Your account is registered as <strong>{role}</strong>. 
                    Only <strong>Restaurant Owners</strong> can enter this portal.
                  </p>
                  <button className="btn btn-primary" onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}>Try another account</button>
                </div>
              </div>
            ) : <Login />
          } />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </>
    );
  }

  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar sidebarVisible={sidebarVisible}/>
      <div id="page-content-wrapper">
        <Menubar toggleSidebar={toggleSidebar} />
        <ToastContainer />
        <div className="container-fluid py-4">
          <div className="bg-white rounded-4 shadow-sm p-4 min-vh-85">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddFood />} />
              <Route path="/edit/:id" element={<EditFood />} />
              <Route path="/list" element={<ListFood />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/register" element={<Navigate to="/" />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
