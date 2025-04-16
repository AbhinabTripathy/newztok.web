import React, { useState, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import axios from 'axios';

const Users = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch journalists from API
  useEffect(() => {
    const fetchJournalists = async () => {
      try {
        setLoading(true);
        // Get the auth token from localStorage or sessionStorage
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Using token:', token.substring(0, 15) + '...'); // Log token for debugging

        // Configure axios headers with the token
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };

        // Set the correct base URL
        const baseURL = 'https://api.newztok.in';

        // Fetch journalists
        const response = await axios.get(`${baseURL}/api/users/assigned-journalists`, config);
        
        console.log('Journalists API response:', response);
        
        if (response.data && response.data.data) {
          // Add mobile field to each user for display purposes since API doesn't provide it
          const journalistsWithMobile = response.data.data.map(user => ({
            ...user,
            // Add dummy mobile number for display
            mobile: user.mobile || '9876543210' // Default mobile number if not provided
          }));
          
          console.log('Journalists with mobile field:', journalistsWithMobile);
          setJournalists(journalistsWithMobile);
        } else {
          setError('No data received from the server');
        }

      } catch (err) {
        console.error('Error fetching journalists:', err);
        // Log more detailed error information
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          setError(`Server error ${err.response.status}: ${err.response.data?.message || 'Failed to load journalists data'}`);
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          setError('No response from server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', err.message);
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJournalists();
  }, []);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Close dropdown when clicking anywhere on the document
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Helper function to get the phone number from various possible fields
  const getPhoneNumber = (user) => {
    // Print all properties for debugging
    console.log(`Looking for phone in user ${user.id || user.username}:`, Object.keys(user));
    
    // Check all possible fields where phone might be stored
    if (user.contact) return user.contact;
    if (user.mobile) return user.mobile;
    if (user.phone) return user.phone;
    if (user.phoneNumber) return user.phoneNumber;
    if (user.contactNumber) return user.contactNumber;
    
    // If we have a contact object, check inside it
    if (user.contactInfo) {
      const contactInfo = user.contactInfo;
      if (typeof contactInfo === 'object') {
        return contactInfo.mobile || contactInfo.phone || contactInfo.number;
      }
      if (typeof contactInfo === 'string') {
        return contactInfo;
      }
    }
    
    return '—';
  };

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
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '12px', 
          borderRadius: '4px', 
          marginBottom: '16px' 
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ 
          padding: '24px 16px',
          textAlign: 'center',
          color: '#6b7280',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}>
          Loading journalists...
        </div>
      ) : (
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                    No journalists available
                  </td>
                </tr>
              ) : (
                users.map(user => {
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px' }}>{user.username || user.name || 'N/A'}</td>
                      <td style={{ padding: '16px' }}>{user.email || 'N/A'}</td>
                      <td style={{ padding: '16px' }}>{user.mobile || '—'}</td>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      {renderUserTable(journalists, 'Journalists')}
    </div>
  );
};

export default Users; 