import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation if using react-router-dom

const LeftSidebar = () => {
  return (
    <div className="leftsidebar overlay-scrollbar scrollbar-hover">
      <ul className="leftsidebar-nav overlay-scrollbar scrollbar-hover">
        {/* Left sidebar navigation items */}
        <li className="leftsidebar-nav-item">
          <Link to="/dashboard" className="leftsidebar-nav-link active">
            <div><i className="fas fa-tachometer-alt"></i></div>
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="leftsidebar-nav-item">
          <Link to="/add_driver" className="leftsidebar-nav-link">
            <div><i className="fas fa-user-plus"></i></div>
            <span>Add Driver</span>
          </Link>
        </li>
        <li className="leftsidebar-nav-item">
          <Link to="/view_all_drivers" className="leftsidebar-nav-link">
            <div><i className="fas fa-users"></i></div>
            <span>View All Drivers</span>
          </Link>
        </li>
        {/* Left sidebar navigation items */}
      </ul>
    </div>
    );
};
export default LeftSidebar;