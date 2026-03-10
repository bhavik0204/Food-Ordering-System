import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AddFood from './pages/AddFood/AddFood';
import ListFood from './pages/ListFood/ListFood';
import Orders from './pages/Orders/Orders';
import ManageRestaurants from './pages/ManageRestaurants/ManageRestaurants';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import './pages/Login/Auth.css';
import Sidebar from './components/Sidebar/Sidebar';
import Menubar from './components/Menubar/Menubar';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role');
    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    }
  }, []);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("AdminPanel Auth Check:", { hasToken: !!token, role });

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }

  // Handle unauthenticated or non-admin users
  if (!token || role !== "ADMIN") {
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={
            token && role !== "ADMIN" ? (
              <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="card shadow p-4 border-0 rounded-4 text-center" style={{maxWidth: '400px'}}>
                  <i className="bi bi-exclamation-triangle-fill text-warning display-4 mb-3"></i>
                  <h3 className="fw-bold">Access Denied</h3>
                  <p className="text-muted">
                    Your account is registered as <strong>{role}</strong>. 
                    Only <strong>ADMIN</strong> accounts can enter this portal.
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

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar sidebarVisible={sidebarVisible}/>
      <div id="page-content-wrapper">
        <Menubar toggleSidebar={toggleSidebar} />
        <ToastContainer />
        <div className="container-fluid py-4">
          <div className="bg-white rounded-4 shadow-sm p-4 min-vh-85">
            <Routes>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/list' element={<ListFood />} />
              <Route path='/restaurants' element={<ManageRestaurants />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/' element={<Dashboard />} />
              <Route path='/login' element={<Dashboard />} />
              <Route path='/register' element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;