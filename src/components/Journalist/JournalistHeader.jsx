import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import Logo from '../../assets/images/NewzTok logo-2.svg';
import AccountDropdown from './AccountDropdown';

const JournalistHeader = () => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  
  const toggleAccountDropdown = () => {
    setAccountDropdownOpen(!accountDropdownOpen);
  };

  const handleBellClick = () => {
    alert('Notifications feature is coming soon! We are working on it.');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#1a1a1a', position: 'relative' }}>
      <img src={Logo} alt="NewzTok Logo" style={{ height: '70px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <FaBell 
          color="#ccc" 
          size={20} 
          onClick={handleBellClick}
          style={{ cursor: 'pointer' }}
        />
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