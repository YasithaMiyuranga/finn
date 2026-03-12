// src/components/Navbar.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex' }}>
        <li style={{ marginRight: '15px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Home</Link>
        </li>
        <li style={{ marginRight: '15px' }}>
          <Link to="/about" style={{ textDecoration: 'none', color: 'black' }}>About</Link>
        </li>
        <li>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'black' }}>Contact</Link>
        </li>

      </ul>
         <button onClick={()=> navigate("/auth/login",{replace:true})}>Button</button>
    </nav>
  );
};

export default Navbar;