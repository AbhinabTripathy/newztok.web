import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaExclamationCircle, FaRedo } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Rejected = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userState, setUserState] = useState('N/A');
  const [userDistrict, setUserDistrict] = useState('N/A');
  const navigate = useNavigate();

  // API Base URL
  const baseURL = 'https://api.newztok.in';
  // Try an alternative base URL if the main one fails
  const alternativeBaseURLs = [
    'https://api.newztok.in',
    'http://13.234.42.114:3333',  // Using the IP address we've seen in other parts of the app
    'https://newztok.in/api'      // Another possible structure
  ];

  // Get auth token - try multiple possible storage keys
  const getAuthToken = () => {
    // Check all possible storage locations for the token
    const storageLocations = [localStorage, sessionStorage];
    const possibleKeys = ['authToken', 'token', 'jwtToken', 'userToken', 'accessToken'];
    
    let foundToken = null;
    let tokenSource = '';
    let state = 'N/A';
    let district = 'N/A';
    
    for (const storage of storageLocations) {
      for (const key of possibleKeys) {
        const token = storage.getItem(key);
        if (token) {
          foundToken = token;
          tokenSource = `${storage === localStorage ? 'localStorage' : 'sessionStorage'}.${key}`;
          console.log(`Found auth token in ${tokenSource}`);
          
          // Try to decode the token to extract state and district
          try {
            // JWT tokens are in the format header.payload.signature
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              // Decode the payload (second part)
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('Token payload:', payload);
              
              // Extract state and district if available
              if (payload.state) state = payload.state;
              if (payload.district) district = payload.district;
              
              // Look in common nested locations too
              if (payload.user && payload.user.state) state = payload.user.state;
              if (payload.user && payload.user.district) district = payload.user.district;
              if (payload.data && payload.data.state) state = payload.data.state;
              if (payload.data && payload.data.district) district = payload.data.district;
              if (payload.location && payload.location.state) state = payload.location.state;
              if (payload.location && payload.location.district) district = payload.location.district;
            }
          } catch (err) {
            console.error('Error decoding token:', err);
          }
          
          return { token: foundToken, source: tokenSource, state, district };
        }
      }
    }
    
    return { token: null, source: 'none', state, district };
  };

  // Try all possible ways to fetch rejected posts
  const fetchRejectedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the auth token
      const { token, source, state, district } = getAuthToken();
      
      // Set the state and district from the token
      setUserState(state);
      setUserDistrict(district);
      
      if (!token) {
        console.log('No token found');
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Configure axios headers with the token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log(`Attempting to fetch rejected posts with token`);
      console.log(`User state: ${state}, district: ${district}`);
      
      // Define all possible endpoints to try in sequence
      const possibleEndpoints = [
        'http://13.234.42.114:3333/api/news/rejected',
        'https://api.newztok.in/api/news/rejected',
        'http://13.234.42.114:3333/api/news?status=rejected',
        'https://api.newztok.in/api/news?status=rejected'
      ];
      
      let success = false;
      let lastError = null;
      
      // Try each endpoint until one succeeds
      for (const endpoint of possibleEndpoints) {
        if (success) break;
        
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          
          const response = await axios({
            method: 'get',
            url: endpoint,
            headers: config.headers,
            timeout: 15000 // Increased to 15 seconds
          });
          
          if (response.data) {
            console.log(`Response received from ${endpoint}:`, response.data);
            
            // Handle different response structures
            let posts = [];
            
            if (Array.isArray(response.data)) {
              posts = response.data;
            } else if (response.data.posts && Array.isArray(response.data.posts)) {
              posts = response.data.posts;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              posts = response.data.data;
            } else {
              // Look for any array in the response
              const arrayKey = Object.keys(response.data).find(key => 
                Array.isArray(response.data[key]) && response.data[key].length > 0
              );
              
              if (arrayKey) {
                posts = response.data[arrayKey];
              }
            }
            
            // Set success flag to avoid trying more endpoints
            success = true;
            
            if (posts.length > 0) {
              console.log(`Successfully fetched ${posts.length} rejected posts`);
              setRejectedPosts(posts);
              setError(null);
            } else {
              console.log('No rejected posts found in the response.');
              setRejectedPosts([]);
              // Don't set error for empty posts - it's a valid state
            }
          }
        } catch (apiError) {
          lastError = apiError;
          console.error(`Error with endpoint ${endpoint}:`, apiError.message);
          
          // If it's a timeout, log specifically
          if (apiError.message.includes('timeout')) {
            console.log(`Timeout occurred with endpoint ${endpoint}, trying next endpoint...`);
          }
          
          // Continue to the next endpoint
          continue;
        }
      }
      
      // If all endpoints failed, show error
      if (!success) {
        console.error('All endpoints failed to fetch rejected posts');
        
        // Check if the last error was a timeout
        if (lastError && lastError.message.includes('timeout')) {
          setError('Server is taking too long to respond. Your rejected posts (if any) will be available once the server responds.');
        } else {
          setError(`Failed to fetch rejected posts: ${lastError ? lastError.message : 'Unknown error'}`);
        }
        
        setRejectedPosts([]);
      }
    } catch (err) {
      console.error('Overall error in fetchRejectedPosts:', err);
      setError(`Error loading rejected posts: ${err.message}`);
      setRejectedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRejectedPosts();
  }, []);

  const toggleDropdown = (postId, event) => {
    // Stop event propagation to prevent immediate closing
    event.stopPropagation();
    
    if (activeDropdown === postId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(postId);
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

  const handleView = (post, event) => {
    event.stopPropagation();
    
    // Navigate to view the post details
    navigate(`/editor/post-details/${post._id || post.id}`);
    
    setActiveDropdown(null);
  };

  const handleEdit = (post, event) => {
    event.stopPropagation();
    
    // Store the post data in sessionStorage for editing
    sessionStorage.setItem('editPostData', JSON.stringify(post));
    
    // Navigate to the edit page
    navigate(`/editor/edit-post/${post._id || post.id}`);
    
    setActiveDropdown(null);
  };

  const handleResubmit = async (post, event) => {
    event.stopPropagation();
    
    try {
      // Get the auth token
      const { token } = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Confirm resubmission
      if (window.confirm('Are you sure you want to resubmit this post for review?')) {
        // Set status back to pending
        console.log(`Resubmitting post ${post._id || post.id}`);
        
        // Try the direct IP address endpoint we've seen work in other parts
        try {
          const response = await axios({
            method: 'patch',
            url: `http://13.234.42.114:3333/api/news/${post._id || post.id}`,
            data: { status: 'pending', resubmitted: true },
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Resubmit response:', response.data);
          alert('Post has been resubmitted for review!');
          
          // Refresh the list
          fetchRejectedPosts();
        } catch (directErr) {
          console.error('Error with direct resubmit:', directErr);
          
          // Try fallback endpoints
          const possibleEndpoints = [
            `http://13.234.42.114:3333/api/news/${post._id || post.id}/resubmit`,
            `http://13.234.42.114:3333/api/news/${post._id || post.id}/status`,
            `https://api.newztok.in/api/news/${post._id || post.id}`
          ];
          
          let success = false;
          
          for (const endpoint of possibleEndpoints) {
            try {
              const payload = endpoint.includes('status') 
                ? { status: 'pending' }
                : { status: 'pending', resubmitted: true };
                
              console.log(`Trying endpoint: ${endpoint} with payload:`, payload);
              
              const response = await axios({
                method: endpoint.includes('status') ? 'put' : 'patch',
                url: endpoint,
                data: payload,
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              console.log('Resubmit response:', response.data);
              success = true;
              break;
            } catch (endpointErr) {
              console.error(`Failed with endpoint ${endpoint}:`, endpointErr.message);
            }
          }
          
          if (!success) {
            alert('Failed to resubmit post. Please try again later.');
          } else {
            alert('Post has been resubmitted for review!');
            fetchRejectedPosts();
          }
        }
      }
    } catch (err) {
      console.error('Error resubmitting post:', err);
      alert(`Failed to resubmit post: ${err.message}`);
    }
    
    setActiveDropdown(null);
  };

  const handleRemove = async (post, event) => {
    event.stopPropagation();
    
    try {
      // Get the auth token
      const { token } = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Confirm deletion
      if (window.confirm('Are you sure you want to permanently delete this post?')) {
        // Delete the post
        console.log(`Deleting post ${post._id || post.id}`);
        
        try {
          const response = await axios({
            method: 'delete',
            url: `http://13.234.42.114:3333/api/news/${post._id || post.id}`,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('Delete response:', response.data);
          alert('Post has been permanently deleted');
          
          // Remove the post from the local state
          setRejectedPosts(prevPosts => 
            prevPosts.filter(p => (p._id || p.id) !== (post._id || post.id))
          );
        } catch (err) {
          console.error('Error with delete request:', err);
          alert('Failed to delete post. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(`Failed to delete post: ${err.message}`);
    }
    
    setActiveDropdown(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort rejected posts by rejection date (most recent first)
  const sortedRejectedPosts = [...rejectedPosts].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.rejectedAt);
    const dateB = new Date(b.updatedAt || b.rejectedAt);
    return dateB - dateA;
  });

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      {/* Header section with title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: 0
        }}>
          All Rejected Posts 
          <span style={{ 
            fontSize: '24px', 
            color: '#6b7280', 
            fontWeight: 'normal'
          }}>
            ({Array.isArray(rejectedPosts) ? rejectedPosts.length : 0})
          </span>
        </h1>
      </div>
      
      {/* Error message */}
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaExclamationCircle />
          {error}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            margin: '0 auto 16px',
            border: '3px solid #e5e7eb',
            borderTopColor: '#4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#6b7280' }}>Loading rejected posts...</p>
        </div>
      )}
      
      {/* Table */}
      {!loading && !error && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          overflowX: 'auto'
        }}>
          {!Array.isArray(rejectedPosts) || rejectedPosts.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px'
            }}>
              <FaExclamationCircle size={36} color="#d1d5db" />
              <div>
                <p style={{ fontWeight: '500', marginBottom: '8px', fontSize: '18px' }}>No rejected posts found</p>
                <p style={{ fontSize: '14px', color: '#9ca3af' }}>All your submitted posts have been approved!</p>
                <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                  Any posts that are rejected by the editor will appear here
                </p>
              </div>
            </div>
          ) : (
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
                    Headline <span style={{ color: '#9ca3af' }}>↓</span>
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Category <span style={{ color: '#9ca3af' }}>↓</span>
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Submitted At <span style={{ color: '#9ca3af' }}>↓</span>
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Rejected At <span style={{ color: '#9ca3af' }}>↓</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(sortedRejectedPosts) && sortedRejectedPosts.map(post => (
                  <tr key={post._id || post.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', maxWidth: '300px' }}>
                      <div style={{ marginBottom: post.featured ? '5px' : '0' }}>
                        <Link 
                          to="#" 
                          style={{ 
                            color: '#3b82f6', 
                            textDecoration: 'none',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '300px'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleView(post, e);
                          }}
                        >
                          {post.headline || post.title}
                        </Link>
                      </div>
                      {post.featured && (
                        <span style={{ 
                          backgroundColor: '#ecfdf5', 
                          color: '#10b981',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          FEATURED
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        backgroundColor: '#f3f4f6',
                        color: '#4b5563',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {post.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>{formatDateTime(post.createdAt || post.submittedAt)}</td>
                    <td style={{ padding: '16px' }}>{formatDateTime(post.updatedAt || post.rejectedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && Array.isArray(rejectedPosts) && rejectedPosts.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <div>
            1 to {rejectedPosts.length} Items of {rejectedPosts.length} — <Link to="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>View all</Link>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              style={{ 
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#e2e8f0',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              disabled={true}
            >
              Previous
            </button>
            <button 
              style={{ 
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              disabled={true}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rejected; 