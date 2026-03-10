import React from 'react';

const Menubar = ({ toggleSidebar }) => {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-3">
      <div className="container-fluid px-4">
        <button className="btn btn-light shadow-sm border rounded-circle" id="sidebarToggle" onClick={toggleSidebar}>
          <i className='bi bi-list px-1'></i>
        </button>
        <div className="d-flex align-items-center gap-4">
          <div className="text-end me-1 d-none d-md-block">
            <div className="small fw-bold text-dark" style={{fontSize: '0.9rem'}}>{email}</div>
            <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 rounded-pill" style={{fontSize: '0.75rem', fontWeight: '600'}}>
              <i className="bi bi-shield-check me-1"></i>{role}
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