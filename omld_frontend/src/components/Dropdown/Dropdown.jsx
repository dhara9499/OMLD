import React from 'react';
import { NavLink } from 'react-router-dom';
import './dropdown.css';

function Dropdown({ links }) {
  return (
    <ul className="dropdown-menu">
      {links.map((link) => (
        <li key={link.path}>
          <NavLink to={link.path}>{link.label}</NavLink>
        </li>
      ))}
    </ul>
  );
}

export default Dropdown;