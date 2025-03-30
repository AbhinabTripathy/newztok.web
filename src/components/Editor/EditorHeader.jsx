import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import { BsSun, BsMoon } from 'react-icons/bs';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import Logo from '../../assets/images/NewzTok logo-2.svg';
import AccountDropdown from './AccountDropdown';

const EditorHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };

    if (accountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountDropdownOpen]);
  
  const toggleAccountDropdown = (e) => {
    e.stopPropagation();
    setAccountDropdownOpen(!accountDropdownOpen);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#1a1a1a', position: 'relative' }}>
      <img src={Logo} alt="NewzTok Logo" style={{ height: '50px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2a2a2a', borderRadius: '5px', padding: '5px 10px' }}>
        <FaSearch color="#ccc" size={20} />
        <input type="text" placeholder="Search articles..." style={{ backgroundColor: 'transparent', border: 'none', color: '#ccc', marginLeft: '5px', outline: 'none', width: '220px' }} />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {darkMode ? (
          <BsMoon color="#ccc" size={20} onClick={() => setDarkMode(false)} style={{ cursor: 'pointer' }} />
        ) : (
          <BsSun color="#ccc" size={20} onClick={() => setDarkMode(true)} style={{ cursor: 'pointer' }} />
        )}
        <FaBell color="#ccc" size={20} />
        <BsGrid3X3GapFill color="#ccc" size={20} />
        <div ref={dropdownRef}>
          <CgProfile 
            color="#ccc" 
            size={20} 
            onClick={toggleAccountDropdown} 
            style={{ cursor: 'pointer' }}
          />
          <AccountDropdown 
            isOpen={accountDropdownOpen} 
            onClose={() => setAccountDropdownOpen(false)}
            email="rajesheditor@newztok.com"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorHeader; 