import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaMap, FaUser } from 'react-icons/fa';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className="nav-item" activeClassName="active">
        <FaHome />
        <span>Home</span>
      </NavLink>
      <NavLink to="/map" className="nav-item" activeClassName="active">
        <FaMap />
        <span>Map</span>
      </NavLink>
      <NavLink to="/profile" className="nav-item" activeClassName="active">
        <FaUser />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
