import React, { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Users = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Sample data based on the image provided
  const editors = [
    {
      id: 1,
      name: 'Abhinab',
      email: 'editor1@newztok.com',
      phone: ''
    },
    {
      id: 2,
      name: 'chatrapati_abhinab',
      email: 'chatrapati_abhinab@gmail.com',
      phone: ''
    },
    {
      id: 3,
      name: 'sang.webdev47@gmail.com',
      email: 'sang.webdev47@gmail.com',
      phone: ''
    },
    {
      id: 4,
      name: 'rahul.editor@newztok.com',
      email: 'rahul.editor@newztok.com',
      phone: ''
    },
    {
      id: 5,
      name: 'testeditor',
      email: 'sang.webdev@gmail.com',
      phone: ''
    },
    {
      id: 6,
      name: 'rajesheditor@newztok.com',
      email: 'rajesheditor@newztok.com',
      phone: ''
    }
  ];

  const journalists = [
    {
      id: 1,
      name: 'Abhi',
      email: 'journalist1@newztok.com',
      phone: ''
    },
    {
      id: 2,
      name: 'prakash.journalist@newztok.com',
      email: 'prakash.journalist@newztok.com',
      phone: ''
    },
    {
      id: 3,
      name: 'rajesh@newztok.com',
      email: 'rajesh@newztok.com',
      phone: ''
    }
  ];

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Close dropdown when clicking anywhere on the document
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const renderUserTable = (users, title) => (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: '#111827',
        marginBottom: '20px'
      }}>
        {title}
      </h2>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflowX: 'auto'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Name <span style={{ color: '#9ca3af' }}>↓</span>
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Email <span style={{ color: '#9ca3af' }}>↓</span>
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Phone Number <span style={{ color: '#9ca3af' }}>↓</span>
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'center', 
                fontWeight: '500',
                color: '#374151'
              }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px' }}>{user.name}</td>
                <td style={{ padding: '16px' }}>{user.email}</td>
                <td style={{ padding: '16px' }}>{user.phone || '—'}</td>
                <td style={{ padding: '16px', textAlign: 'center', position: 'relative' }}>
                  <div onClick={(e) => e.stopPropagation()}>
                    <button 
                      style={{ 
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: '5px'
                      }}
                      onClick={(e) => toggleDropdown(`${title}-${user.id}`, e)}
                      aria-label="More options"
                    >
                      <FaEllipsisV />
                    </button>
                    
                    {activeDropdown === `${title}-${user.id}` && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: 'absolute',
                          right: '0',
                          top: '100%',
                          marginTop: '8px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          width: '140px',
                          zIndex: 10,
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <div 
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Edit user:', user.id);
                            setActiveDropdown(null);
                          }}
                        >
                          Edit
                        </div>
                        <div 
                          style={{
                            padding: '12px 16px',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Remove user:', user.id);
                            setActiveDropdown(null);
                          }}
                        >
                          Remove
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      {renderUserTable(editors, 'Editors')}
      {renderUserTable(journalists, 'Journalists')}
    </div>
  );
};

export default Users; 