import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBell } from 'react-icons/fa';
import { BsSun, BsMoon } from 'react-icons/bs';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { IoExitOutline } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { BiSquare } from 'react-icons/bi';
import Logo from '../../assets/images/NewzTok logo-2.svg';
import AccountDropdown from './AccountDropdown';

const JournalistHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  
  const toggleAccountDropdown = () => {
    setAccountDropdownOpen(!accountDropdownOpen);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#1a1a1a', position: 'relative' }}>
      <img src={Logo} alt="NewzTok Logo" style={{ height: '50px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2a2a2a', borderRadius: '5px', padding: '5px 10px' }}>
        <FaSearch color="#ccc" size={20} />
        <input type="text" placeholder="Search..." style={{ backgroundColor: 'transparent', border: 'none', color: '#ccc', marginLeft: '5px', outline: 'none', width: '200px' }} />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {darkMode ? (
          <BsMoon color="#ccc" size={20} onClick={() => setDarkMode(false)} style={{ cursor: 'pointer' }} />
        ) : (
          <BsSun color="#ccc" size={20} onClick={() => setDarkMode(true)} style={{ cursor: 'pointer' }} />
        )}
        <FaBell color="#ccc" size={20} />
        <BsGrid3X3GapFill color="#ccc" size={20} />
        <CgProfile 
          color="#ccc" 
          size={20} 
          onClick={toggleAccountDropdown} 
          style={{ cursor: 'pointer' }}
        />
      </div>
      
      <AccountDropdown 
        isOpen={accountDropdownOpen} 
        onClose={() => setAccountDropdownOpen(false)}
      />
    </div>
  );
};

export default JournalistHeader; 