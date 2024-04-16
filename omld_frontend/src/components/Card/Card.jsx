import React from 'react';
import { NavLink } from 'react-router-dom';
import './card.css';


function Card(props) {
    const { title, module, text, imageUrl, buttonText, buttonLink } = props;
    const path = "/" + module;
    return (
        <div className='col-md-4'>
            <NavLink to={path}>
                <div className="card">
                    {imageUrl && <img src={imageUrl} alt="Card image" className="card-image" />}
                    <div className="card-content">
                        <h3 className="card-title">{title}</h3>
                    </div>
                </div>
            </NavLink>
        </div>
    );
  }
  
  export default Card;