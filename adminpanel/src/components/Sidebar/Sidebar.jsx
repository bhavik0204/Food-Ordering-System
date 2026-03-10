import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Sidebar = ({ sidebarVisible }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <div className={`border-end bg-white ${sidebarVisible ? '' : 'd-none'}`} id="sidebar-wrapper" style={{ transition: 'all 0.3s' }}>
      <div className="sidebar-heading border-bottom bg-white py-4 px-3 text-center">
        <img src={assets.logo} alt="Logo" height={45} width={45} className="mb-2 shadow-sm rounded-circle" />
        <h5 className="m-0 fw-bold text-dark mt-2" style={{letterSpacing: '-0.5px'}}>Admin Portal</h5>
      </div>
      <div className="list-group list-group-flush p-2">
        <Link className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 p-3 transition-all ${isActive('/dashboard')}`} to="/dashboard">
          <i className='bi bi-grid-1x2-fill me-3'></i> Dashboard
        </Link>
        <Link className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 p-3 transition-all ${isActive('/list')}`} to="/list">
          <i className='bi bi-list-stars me-3'></i> All Food Items
        </Link>
        <Link className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 p-3 transition-all ${isActive('/restaurants')}`} to="/restaurants">
          <i className='bi bi-shop-window me-3'></i> Restaurants
        </Link>
        <Link className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 p-3 transition-all ${isActive('/orders')}`} to="/orders">
          <i className='bi bi-cart4 me-3'></i> Orders
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        #sidebar-wrapper .list-group-item {
          color: #6c757d;
          font-weight: 500;
        }
        #sidebar-wrapper .list-group-item:hover {
          background-color: #f8f9fa;
          color: #0b5ed7;
        }
        #sidebar-wrapper .list-group-item.active {
          background-color: #e7f1ff;
          color: #0b5ed7;
          font-weight: 600;
        }
      `}} />
    </div>
  )
}

export default Sidebar;