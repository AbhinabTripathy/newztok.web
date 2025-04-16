import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaExclamationCircle, FaRedo } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Rejected = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [userState, setUserState] = useState('N/A');
  const [userDistrict, setUserDistrict] = useState('N/A');
  const navigate = useNavigate();

  // API Base URL
  const baseURL = 'https://api.newztok.in';

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
      
      // Get the auth token
      const { token, source, state, district } = getAuthToken();
      
      // Set the state and district from the token
      setUserState(state);
      setUserDistrict(district);
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      // Configure axios headers with the token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log(`Trying to fetch rejected posts with token from ${source}`);
      console.log(`User state: ${state}, district: ${district}`);
      
      // Try multiple endpoints and approaches
      let success = false;
      let fetchedPosts = [];
      let successSource = '';
      let responseData = null;
      
      // List of possible approaches to try
      const approaches = [
        // Approach 1: Direct rejected endpoint
        {
          url: `${baseURL}/api/news/rejected`,
          method: 'get',
          params: {},
          description: 'Direct /rejected endpoint'
        },
        // Approach 2: Use status filter on main endpoint
        {
          url: `${baseURL}/api/news`,
          method: 'get',
          params: { status: 'rejected' },
          description: 'Main endpoint with status=rejected'
        },
        // Approach 3: Alternative endpoint structure
        {
          url: `${baseURL}/api/posts/rejected`,
          method: 'get',
          params: {},
          description: 'Alternative /posts/rejected endpoint'
        },
        // Approach 4: Get all posts and filter client-side
        {
          url: `${baseURL}/api/news`,
          method: 'get',
          params: {},
          filterFn: (posts) => posts.filter(post => 
            post.status === 'rejected' || 
            post.state === 'rejected' || 
            post.reviewStatus === 'rejected'
          ),
          description: 'All posts filtered client-side'
        },
        // Approach 5: User-specific endpoint
        {
          url: `${baseURL}/api/user/posts/rejected`,
          method: 'get',
          params: {},
          description: 'User-specific rejected posts'
        }
      ];
      
      // Try each approach until one works
      for (const approach of approaches) {
        try {
          console.log(`Trying approach: ${approach.description}`);
          
          const response = await axios({
            method: approach.method,
            url: approach.url,
            params: approach.params,
            headers: config.headers
          });
          
          console.log(`Response from ${approach.description}:`, response.data);
          responseData = response.data;
          
          // Process the response based on its structure
          if (Array.isArray(response.data)) {
            if (approach.filterFn) {
              // If this approach uses a filter function, apply it
              fetchedPosts = approach.filterFn(response.data);
              console.log(`After filtering: ${fetchedPosts.length} rejected posts`);
            } else {
              fetchedPosts = response.data;
            }
            
            if (fetchedPosts.length > 0) {
              success = true;
              successSource = approach.description;
              // Debug: log the structure of the first post to find state/district
              console.log("Sample post structure:", JSON.stringify(fetchedPosts[0], null, 2));
              break;
            }
          } else if (response.data && Array.isArray(response.data.posts)) {
            if (approach.filterFn) {
              fetchedPosts = approach.filterFn(response.data.posts);
            } else {
              fetchedPosts = response.data.posts;
            }
            
            if (fetchedPosts.length > 0) {
              success = true;
              successSource = approach.description;
              break;
            }
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            // Some APIs nest data one level deeper
            if (approach.filterFn) {
              fetchedPosts = approach.filterFn(response.data.data);
            } else {
              fetchedPosts = response.data.data;
            }
            
            if (fetchedPosts.length > 0) {
              success = true;
              successSource = approach.description;
              break;
            }
          } else if (response.data && typeof response.data === 'object') {
            // If it's an object with multiple keys, try to find an array property
            const arrayProps = Object.keys(response.data).filter(key => 
              Array.isArray(response.data[key]) && response.data[key].length > 0
            );
            
            if (arrayProps.length > 0) {
              for (const prop of arrayProps) {
                const possiblePosts = approach.filterFn 
                  ? approach.filterFn(response.data[prop])
                  : response.data[prop];
                  
                if (possiblePosts.length > 0) {
                  fetchedPosts = possiblePosts;
                  success = true;
                  successSource = `${approach.description} (${prop} property)`;
                  break;
                }
              }
              
              if (success) break;
            }
          }
        } catch (approachErr) {
          console.error(`Error with approach ${approach.description}:`, approachErr.message);
        }
      }
      
      if (success) {
        console.log(`Successfully fetched ${fetchedPosts.length} rejected posts using ${successSource}`);
        setRejectedPosts(fetchedPosts);
        setError(null);
      } else {
        console.log('Failed to find rejected posts with any approach');
        
        // If all approaches failed but we got some data, provide it for debugging
        setRejectedPosts([]);
        setError('No rejected posts found with any approach.');
      }
    } catch (err) {
      console.error('Error fetching rejected posts:', err);
      setError(err.response?.data?.message || `Failed to load rejected posts: ${err.message}`);
      setRejectedPosts([]);
    } finally {
      setLoading(false);
      setRetrying(false);
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
        
        // Try different endpoints since the exact one might not be implemented yet
        let success = false;
        const possibleEndpoints = [
          `${baseURL}/api/news/${post._id || post.id}/resubmit`,
          `${baseURL}/api/news/${post._id || post.id}/status`,
          `${baseURL}/api/news/${post._id || post.id}`
        ];
        
        for (const endpoint of possibleEndpoints) {
          try {
            // Different payload for different endpoints
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
          throw new Error('Failed to resubmit post. Please try again later.');
        }
        
        alert('Post has been resubmitted for review!');
        
        // Refresh the list
        fetchRejectedPosts();
      }
    } catch (err) {
      console.error('Error resubmitting post:', err);
      alert(`Failed to resubmit post: ${err.response?.data?.message || err.message}`);
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
        
        const response = await axios({
          method: 'delete',
          url: `${baseURL}/api/news/${post._id || post.id}`,
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
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(`Failed to delete post: ${err.response?.data?.message || err.message}`);
    }
    
    setActiveDropdown(null);
  };

  const handleRetry = () => {
    setRetrying(true);
    fetchRejectedPosts();
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
        
        <button
          onClick={handleRetry}
          disabled={loading || retrying}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: loading || retrying ? 'not-allowed' : 'pointer',
            opacity: loading || retrying ? 0.7 : 1
          }}
        >
          <FaRedo size={14} />
          {retrying ? 'Refreshing...' : 'Refresh'}
        </button>
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
              gap: '16px'
            }}>
              <FaExclamationCircle size={36} color="#d1d5db" />
              <div>
                <p style={{ fontWeight: '500', marginBottom: '8px' }}>No rejected posts found</p>
                <p style={{ fontSize: '14px', color: '#9ca3af' }}>When posts are rejected, they will appear here</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                  Note: Make sure posts are being properly marked as "rejected" in the system
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
                    State <span style={{ color: '#9ca3af' }}>↓</span>
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    District <span style={{ color: '#9ca3af' }}>↓</span>
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Rejection Date <span style={{ color: '#9ca3af' }}>↓</span>
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Submitted At <span style={{ color: '#9ca3af' }}>↓</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(rejectedPosts) && rejectedPosts.map(post => (
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
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        backgroundColor: '#f3f4f6',
                        color: '#4b5563',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {userState}
                      </span>
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
                        {userDistrict}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>{formatDate(post.updatedAt || post.rejectedAt)}</td>
                    <td style={{ padding: '16px' }}>{formatDateTime(post.createdAt || post.submittedAt)}</td>
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