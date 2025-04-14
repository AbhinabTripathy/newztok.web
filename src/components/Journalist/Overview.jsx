import React, { useState, useEffect } from 'react';
import { FaBuilding } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';
import { MdErrorOutline } from 'react-icons/md';
import axios from 'axios';

const Overview = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
        const baseURL = 'https://newztok.in';

        // Fetch user profile data
        try {
          const profileResponse = await axios.get(`${baseURL}/api/users/my-profile`, config);
          console.log('Profile response:', profileResponse.data);
          
          if (profileResponse.data) {
            const userData = profileResponse.data.data || profileResponse.data;
            if (userData && userData.username) {
              setUsername(userData.username);
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }

        // Create an array of promises for all three requests
        const promises = [
          // Fetch pending news
          axios.get(`${baseURL}/api/news/my-pending-news`, config),
          // Fetch approved news 
          axios.get(`${baseURL}/api/news/my-approved-news`, config),
          // Fetch rejected news
          axios.get(`${baseURL}/api/news/my-rejected-news`, config)
        ];

        // Wait for all requests to complete
        const [pendingResponse, approvedResponse, rejectedResponse] = await Promise.all(promises);
        
        console.log('Pending news response:', pendingResponse.data);
        console.log('Approved news response:', approvedResponse.data);
        console.log('Rejected news response:', rejectedResponse.data);
        
        // Update the counts
        setPendingCount(pendingResponse.data?.data?.length || 0);
        setApprovedCount(approvedResponse.data?.data?.length || 0);
        setRejectedCount(rejectedResponse.data?.data?.length || 0);

      } catch (err) {
        console.error('Error fetching news data:', err);
        // Log more detailed error information
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          setError(`Server error ${err.response.status}: ${err.response.data?.message || 'Failed to load news data'}`);
        } else if (err.request) {
          console.error('No response received:', err.request);
          setError('No response from server. Please check your connection.');
        } else {
          console.error('Error message:', err.message);
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overview-container" style={{ padding: '30px' }}>
      {username && (
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold',
          color: '#4f46e5', 
          marginBottom: '30px' 
        }}>
          Welcome {username}
        </h2>
      )}

      {error && (
        <div style={{ 
          backgroundColor: '#ffe6e6', 
          color: '#ff0000', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        gap: '24px' 
      }}>
        {/* Approved Posts Card */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              backgroundColor: '#e6f0ff', 
              borderRadius: '8px', 
              width: '50px', 
              height: '50px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <IoDocumentTextOutline size={24} color="#0055ff" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginRight: '12px' }}>
              {loading ? '...' : approvedCount}
            </h2>
            <span style={{ fontSize: '18px', color: '#6b7280' }}>Posts</span>
          </div>
          <p style={{ color: '#6b7280', margin: 0 }}>Approved</p>
        </div>

        {/* Pending Approvals Card */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              backgroundColor: '#fff1e6', 
              borderRadius: '8px', 
              width: '50px', 
              height: '50px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <BsClockHistory size={24} color="#ff6b00" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginRight: '12px' }}>
              {loading ? '...' : pendingCount}
            </h2>
            <span style={{ fontSize: '18px', color: '#6b7280' }}>Posts</span>
          </div>
          <p style={{ color: '#6b7280', margin: 0 }}>Pending Approvals</p>
        </div>

        {/* Rejected Posts Card */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              backgroundColor: '#ffe6e6', 
              borderRadius: '8px', 
              width: '50px', 
              height: '50px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <MdErrorOutline size={24} color="#ff0000" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginRight: '12px' }}>
              {loading ? '...' : rejectedCount}
            </h2>
            <span style={{ fontSize: '18px', color: '#6b7280' }}>Rejects</span>
          </div>
          <p style={{ color: '#6b7280', margin: 0 }}>Post Rejected</p>
        </div>
      </div>
    </div>
  );
};

export default Overview; 