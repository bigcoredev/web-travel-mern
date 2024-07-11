import React from 'react';
import './HomePage.css'; 
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const HomePage = () => {
  let navigate = useNavigate();
  return (
    <div className='homepage-container'>
      <div className='landing-logo'>
       <h1 className='logo-name text-black'>TravelBooth</h1>
       <img src={logo} alt="TravelBooth Logo" className="logo-image" />
      </div>
      <div className='buttons'>
        <button onClick={() => navigate('/login')} className="button">Log in</button>
        <button onClick={() => navigate('/signup')} className="button">Sign up</button>
      </div>
    </div>
  );
};

export default HomePage;