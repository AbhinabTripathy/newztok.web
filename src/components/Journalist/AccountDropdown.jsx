import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiHelpCircle, FiGlobe, FiUserPlus, FiLogOut } from 'react-icons/fi';
import { FaQuestionCircle } from 'react-icons/fa';

const AccountDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const handleLogout = () => {
    // You can add any logout logic here (clearing tokens, etc.)
    // Then navigate to the login page
    navigate('/login');
    onClose(); // Close the dropdown
  };

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: '60px', 
        right: '20px', 
        width: '300px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e5e7eb',
        zIndex: 1000,
      }}
    >
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div 
          style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '8px', 
            backgroundColor: '#e5e7eb',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px'
          }}
        >
          <FaQuestionCircle size={24} color="#6b7280" />
        </div>
        <h3 style={{ margin: '10px 0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Journalist</h3>
        
        <div 
          style={{ 
            width: '100%', 
            padding: '10px 12px', 
            borderRadius: '8px', 
            border: '1px solid #e5e7eb',
            fontSize: '16px',
            color: '#9ca3af',
            marginBottom: '10px',
            cursor: 'pointer'
          }}
        >
          Update your status
        </div>
      </div>
      
      <div style={{ padding: '0 20px' }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px 0', 
            cursor: 'pointer',
            color: '#4b5563'
          }}
        >
          <FiUser size={20} style={{ marginRight: '12px' }} />
          <span style={{ fontSize: '16px' }}>Profile</span>
        </div>
        
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px 0', 
            cursor: 'pointer',
            color: '#4b5563'
          }}
        >
          <FiSettings size={20} style={{ marginRight: '12px' }} />
          <span style={{ fontSize: '16px' }}>Settings & Privacy</span>
        </div>
        
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px 0', 
            cursor: 'pointer',
            color: '#4b5563'
          }}
        >
          <FiHelpCircle size={20} style={{ marginRight: '12px' }} />
          <span style={{ fontSize: '16px' }}>Help Center</span>
        </div>
        
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px 0', 
            cursor: 'pointer',
            color: '#4b5563',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '12px'
          }}
        >
          <FiGlobe size={20} style={{ marginRight: '12px' }} />
          <span style={{ fontSize: '16px' }}>Language</span>
        </div>
        
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px 0', 
            cursor: 'pointer',
            color: '#4b5563',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '12px'
          }}
        >
          <FiUserPlus size={20} style={{ marginRight: '12px' }} />
          <span style={{ fontSize: '16px' }}>Add another account</span>
        </div>
      </div>
      
      <div style={{ padding: '0 20px 20px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          <FiLogOut style={{ marginRight: '8px' }} /> Sign out
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '14px', color: '#6b7280' }}>
          <span style={{ margin: '0 5px', cursor: 'pointer' }}>Privacy policy</span>
          <span>•</span>
          <span style={{ margin: '0 5px', cursor: 'pointer' }}>Terms</span>
          <span>•</span>
          <span style={{ margin: '0 5px', cursor: 'pointer' }}>Cookies</span>
        </div>
      </div>
    </div>
  );
};

export default AccountDropdown; 