import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        📦 Inventory Manager
      </div>
      <div className="navbar-links">
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/products" className={isActive('/products') ? 'active' : ''}>
          Products
        </Link>
        <Link to="/categories" className={isActive('/categories') ? 'active' : ''}>
          Categories
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;