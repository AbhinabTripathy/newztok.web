import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaUser, FaEnvelope, FaUserTag } from 'react-icons/fa';
import { FaFileAlt, FaTimesCircle, FaRegNewspaper } from 'react-icons/fa';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({
    approvedPosts: 0,
    membersAdded: 0,
    pendingApprovals: 0,
    rejectedPosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenData, setTokenData] = useState({
    username: '',
    email: ''
  });
  const navigate = useNavigate();

  // API Base URL
  const baseURL = 'http://13.234.42.114:3333';

  // Function to decode JWT token
  const decodeToken = (token) => {
    try {
      // Get the payload part of the token (second part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Decode the base64 string
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error decoding token:', err);
      return {};
    }
  };

  // Extract user info directly from raw token
  const extractRawTokenInfo = (rawToken) => {
    try {
      // Try splitting the token manually
      const parts = rawToken.split('.');
      if (parts.length !== 3) return null;
      
      // Base64 decode the payload
      const payload = parts[1];
      // Add padding if needed
      const paddedPayload = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
      
      // Decode base64
      const decoded = JSON.parse(atob(paddedPayload));
      console.log('Manual token decode:', decoded);
      return decoded;
    } catch (err) {
      console.error('Error in manual token decode:', err);
      return null;
    }
  };

  // Extract data from token
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      try {
        // Try the standard decoding
        let decoded = decodeToken(token);
        
        // If standard decoding failed, try the manual extraction
        if (!decoded || Object.keys(decoded).length === 0) {
          decoded = extractRawTokenInfo(token);
        }
        
        console.log('Decoded token:', decoded);
        
        if (decoded) {
          // Extract username and email from decoded token
          // JWT tokens may have email in different fields depending on the JWT provider
          const possibleEmailFields = ['email', 'sub', 'mail', 'emailAddress', 'userEmail'];
          const possibleUsernameFields = ['username', 'name', 'preferred_username', 'userName', 'login'];
          
          // Try each possible field name for email
          let tokenEmail = '';
          for (const field of possibleEmailFields) {
            if (decoded[field]) {
              tokenEmail = decoded[field];
              console.log(`Found email in field: ${field}`);
              break;
            }
          }
          
          // Try each possible field name for username
          let tokenUsername = '';
          for (const field of possibleUsernameFields) {
            if (decoded[field]) {
              tokenUsername = decoded[field];
              console.log(`Found username in field: ${field}`);
              break;
            }
          }
          
          // Log all token fields to help debug
          console.log('All token fields:', Object.keys(decoded));
          console.log('Extracted from token - Email:', tokenEmail, 'Username:', tokenUsername);
          
          setTokenData({
            username: tokenUsername,
            email: tokenEmail
          });
          
          // Store in localStorage and sessionStorage
          if (tokenUsername) {
            localStorage.setItem('username', tokenUsername);
            sessionStorage.setItem('username', tokenUsername);
          }
          
          if (tokenEmail) {
            localStorage.setItem('userEmail', tokenEmail);
            sessionStorage.setItem('userEmail', tokenEmail);
          }
        }
      } catch (error) {
        console.error('Error processing token:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Get the auth token from localStorage or sessionStorage
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Configure axios headers with the token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Fetch editor profile
      const profileResponse = await axios.get(`${baseURL}/api/users/editor-profile`, config);
      console.log('Profile response:', profileResponse.data);
      setProfileData(profileResponse.data);
      
      // Fetch stats data
      try {
        // Fetch pending news
        const pendingResponse = await axios.get(`${baseURL}/api/news/pending`, config);
        
        // Fetch assigned journalists
        const journalistsResponse = await axios.get(`${baseURL}/api/users/assigned-journalists`, config);
        
        // Fetch rejected posts
        const rejectedResponse = await axios.get(`${baseURL}/api/news/rejected`, config);
        
        // Fetch approved posts
        const approvedResponse = await axios.get(`${baseURL}/api/news/approved-by-me`, config);
        
        // Update stats
        setStats({
          pendingApprovals: pendingResponse.data?.data?.length || 
                          (Array.isArray(pendingResponse.data) ? pendingResponse.data.length : 0),
          membersAdded: journalistsResponse.data?.data?.length || 
                        (Array.isArray(journalistsResponse.data) ? journalistsResponse.data.length : 0),
          rejectedPosts: rejectedResponse.data?.data?.length || 
                        (Array.isArray(rejectedResponse.data) ? rejectedResponse.data.length : 0),
          approvedPosts: approvedResponse.data?.data?.length || 
                        (Array.isArray(approvedResponse.data) ? approvedResponse.data.length : 0),
        });
      } catch (statsErr) {
        console.error('Error fetching stats:', statsErr);
        // Continue with profile display even if stats fail
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/editor/overview');
  };

  // Extract data from profile response (handle different response formats)
  const extractProfileData = () => {
    if (!profileData) return {};
    
    // Check different possible structures
    if (profileData.data) {
      return profileData.data;
    }
    return profileData;
  };

  const userData = extractProfileData();
  
  // Store username and email in localStorage/sessionStorage for other components
  useEffect(() => {
    if (userData && userData.email) {
      localStorage.setItem('userEmail', userData.email);
      sessionStorage.setItem('userEmail', userData.email);
    }
    if (userData && userData.username) {
      localStorage.setItem('username', userData.username);
      sessionStorage.setItem('username', userData.username);
    }
  }, [userData]);

  // Get the best available data, prioritizing API response over token data
  const displayName = userData.username || tokenData.username || localStorage.getItem('username') || sessionStorage.getItem('username') || 'Editor';
  const displayEmail = userData.email || tokenData.email || localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || 'Not specified';
  const displayRole = userData.role || 'Editor';

  console.log('Display values:', { displayName, displayEmail, displayRole });
  console.log('userData:', userData);
  console.log('tokenData:', tokenData);

  return (
    <div style={{ 
      padding: '30px', 
      backgroundColor: '#f4f6f8',
      minHeight: '100vh'
    }}>
      {/* Back Button */}
      <button 
        onClick={handleGoBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#4b5563',
          fontSize: '14px',
          cursor: 'pointer',
          padding: '8px 0',
          marginBottom: '16px'
        }}
      >
        <FaArrowLeft /> Back to Dashboard
      </button>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '30px'
      }}>
        {/* Profile Info Card */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile information...</div>
          ) : error ? (
            <div style={{ 
              padding: '20px', 
              color: '#ef4444', 
              textAlign: 'center' 
            }}>
              {error}
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div style={{ 
                padding: '30px 20px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#4f46e5',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '40px',
                  fontWeight: 'bold',
                  marginBottom: '16px'
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <h2 style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: '8px 0'
                }}>
                  {displayName}
                </h2>
                <div style={{ 
                  fontSize: '16px',
                  color: '#4f46e5',
                  fontWeight: '500'
                }}>
                  {displayRole}
                </div>
              </div>
              
              {/* Profile Details */}
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '16px'
                  }}>
                    Profile Information
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        backgroundColor: 'rgba(79, 70, 229, 0.1)', 
                        padding: '10px', 
                        borderRadius: '8px',
                        color: '#4f46e5'
                      }}>
                        <FaUser />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Username</div>
                        <div style={{ fontSize: '16px', color: '#111827' }}>{displayName}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        backgroundColor: 'rgba(79, 70, 229, 0.1)', 
                        padding: '10px', 
                        borderRadius: '8px',
                        color: '#4f46e5'
                      }}>
                        <FaEnvelope />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Email</div>
                        <div style={{ fontSize: '16px', color: '#111827' }}>
                          {displayEmail}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        backgroundColor: 'rgba(79, 70, 229, 0.1)', 
                        padding: '10px', 
                        borderRadius: '8px',
                        color: '#4f46e5'
                      }}>
                        <FaUserTag />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Role</div>
                        <div style={{ fontSize: '16px', color: '#111827' }}>{displayRole}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Stats Section */}
        <div>
          <h2 style={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '24px'
          }}>
            Activity Overview
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          }}>
            {/* Approved Posts */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                backgroundColor: 'rgba(37, 99, 235, 0.1)', 
                borderRadius: '8px',
                padding: '12px',
                marginRight: '20px'
              }}>
                <FaRegNewspaper size={28} color="#1d4ed8" />
              </div>
              <div>
                <h2 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  margin: '0',
                  color: '#111827'
                }}>
                  {loading ? '...' : stats.approvedPosts}
                </h2>
                <div style={{ fontSize: '16px', color: '#4b5563' }}>Posts Approved</div>
              </div>
            </div>

            {/* Members */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                backgroundColor: 'rgba(22, 163, 74, 0.1)', 
                borderRadius: '8px',
                padding: '12px',
                marginRight: '20px'
              }}>
                <FaUser size={28} color="#15803d" />
              </div>
              <div>
                <h2 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  margin: '0',
                  color: '#111827'
                }}>
                  {loading ? '...' : stats.membersAdded}
                </h2>
                <div style={{ fontSize: '16px', color: '#4b5563' }}>Journalists Added</div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                backgroundColor: 'rgba(234, 88, 12, 0.1)', 
                borderRadius: '8px',
                padding: '12px',
                marginRight: '20px'
              }}>
                <FaFileAlt size={28} color="#ea580c" />
              </div>
              <div>
                <h2 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  margin: '0',
                  color: '#111827'
                }}>
                  {loading ? '...' : stats.pendingApprovals}
                </h2>
                <div style={{ fontSize: '16px', color: '#4b5563' }}>Pending Approvals</div>
              </div>
            </div>

            {/* Rejected Posts */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                backgroundColor: 'rgba(220, 38, 38, 0.1)', 
                borderRadius: '8px',
                padding: '12px',
                marginRight: '20px'
              }}>
                <FaTimesCircle size={28} color="#dc2626" />
              </div>
              <div>
                <h2 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  margin: '0',
                  color: '#111827'
                }}>
                  {loading ? '...' : stats.rejectedPosts}
                </h2>
                <div style={{ fontSize: '16px', color: '#4b5563' }}>Posts Rejected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 