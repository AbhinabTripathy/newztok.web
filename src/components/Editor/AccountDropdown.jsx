import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaQuestionCircle, FaGlobe, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import MenuItem from './MenuItem';

const AccountDropdown = ({ isOpen, onClose, email }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Enhanced sign out function with better cleanup
  const handleSignOut = () => {
    // First close the dropdown
    onClose();
    
    // Clear all authentication tokens
    localStorage.removeItem('editorAuth');
    sessionStorage.removeItem('editorAuth');
    localStorage.removeItem('journalistAuth');
    sessionStorage.removeItem('journalistAuth');
    
    // Use setTimeout to ensure the dropdown is fully closed before navigation
    setTimeout(() => {
      // Redirect to login page - use absolute path to ensure it works
      navigate('/login', { replace: true });
    }, 100);
  };

  // Base64 encoded question mark SVG
  const questionMarkSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z'/%3E%3C/svg%3E";

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px', // Adjust based on your header height
        right: '20px',
        width: '280px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {/* Avatar and Email Section */}
      <div style={{ 
        padding: '24px 0', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '4px',
          backgroundColor: '#e5e7eb',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '12px',
          border: '1px solid #d1d5db'
        }}>
          <img 
            src={questionMarkSvg} 
            alt="Profile" 
            style={{ width: '24px', height: '24px' }} 
          />
        </div>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '500', 
          color: '#111827',
          textAlign: 'center'
        }}>
          {email || 'rajesheditor@newztok.com'}
        </div>
      </div>
      
      {/* Status Update Section */}
      <div style={{ padding: '16px 16px', borderBottom: '1px solid #e5e7eb' }}>
        <input
          type="text"
          placeholder="Update your status"
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px',
            color: '#6b7280'
          }}
        />
      </div>
      
      {/* Menu Items */}
      <div>
        <MenuItem icon={<FaUser size={18} />} text="Profile" onClick={() => {}} />
        <MenuItem icon={<FaCog size={18} />} text="Settings & Privacy" onClick={() => {}} />
        <MenuItem icon={<FaQuestionCircle size={18} />} text="Help Center" onClick={() => {}} />
        <MenuItem icon={<FaGlobe size={18} />} text="Language" onClick={() => {}} />
      </div>
      
      {/* Divider */}
      <div style={{ borderTop: '1px solid #e5e7eb' }}></div>
      
      {/* Add Another Account */}
      <div>
        <MenuItem icon={<FaUserPlus size={18} />} text="Add another account" onClick={() => {}} />
      </div>
      
      {/* Divider */}
      <div style={{ borderTop: '1px solid #e5e7eb' }}></div>
      
      {/* Sign Out Button */}
      <div style={{ padding: '8px 16px' }}>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
            fontSize: '16px',
            color: '#374151',
            cursor: 'pointer'
          }}
        >
          <FaSignOutAlt style={{ marginRight: '12px' }} />
          Sign out
        </button>
      </div>
      
      {/* Footer */}
      <div style={{ 
        padding: '16px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px', 
        fontSize: '14px', 
        color: '#6b7280' 
      }}>
        <span>Privacy policy</span>
        <span>•</span>
        <span>Terms</span>
        <span>•</span>
        <span>Cookies</span>
      </div>
    </div>
  );
};

export default AccountDropdown; 