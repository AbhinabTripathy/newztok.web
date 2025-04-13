import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaEllipsisV, FaFileAlt, FaVideo, FaStar, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Posts = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [actionDropdowns, setActionDropdowns] = useState({});
  const dropdownRef = useRef(null);
  const actionDropdownRefs = useRef({});
  const navigate = useNavigate();

  // API Base URL
  const baseURL = 'http://13.234.42.114:3333';

  // Fetch approved posts
  useEffect(() => {
    fetchApprovedPosts();
  }, []);

  const fetchApprovedPosts = async () => {
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

      // Fetch approved posts
      const response = await axios.get(`${baseURL}/api/news/approved-by-me`, config);
      
      console.log('Approved posts response:', response.data);
      
      // Update the posts array based on response format and ensure featured status is properly set
      let fetchedPosts = [];
      
      if (Array.isArray(response.data)) {
        fetchedPosts = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        fetchedPosts = response.data.data;
      } else {
        console.log('Unexpected API response format:', response.data);
        fetchedPosts = [];
      }
      
      // Log each post's featured status for debugging
      fetchedPosts.forEach(post => {
        console.log(`Post ID ${post.id || post._id} | Initial featured status from API:`, {
          isFeatured: post.isFeatured,
          featured: post.featured
        });
      });
      
      // Set posts with a clean object to ensure reactivity and handle missing properties
      setPosts(fetchedPosts.map(post => {
        // Explicitly check for true, default to false if undefined/null
        const serverIsFeatured = post.isFeatured === true;
        const serverFeatured = post.featured === true; 
        const isCurrentlyFeatured = serverIsFeatured || serverFeatured;
        
        return {
          ...post,
          // Ensure both featured properties are consistent and default to false
          featured: isCurrentlyFeatured !== undefined ? isCurrentlyFeatured : false,
          isFeatured: isCurrentlyFeatured !== undefined ? isCurrentlyFeatured : false
        };
      }));
      
      setError(null);

    } catch (err) {
      console.error('Error fetching approved posts:', err);
      setError('Failed to load approved posts data');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle featured status
  const toggleFeatured = async (postId, currentFeatured) => {
    try {
      console.log(`Starting toggleFeatured for post ${postId}`);
      console.log('Current featured status:', currentFeatured);
      
      // Get the auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Setup headers with the token
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      // Create request body - explicitly setting the new status
      const newFeaturedStatus = !currentFeatured;
      const requestBody = JSON.stringify({
        isFeatured: newFeaturedStatus
      });
      console.log('Request body:', requestBody);

      // Setup request options
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: requestBody,
        redirect: "follow"
      };

      const endpoint = `${baseURL}/api/news/featured/${postId}`;
      console.log('Making request to:', endpoint);

      // Make the request
      const response = await fetch(endpoint, requestOptions);
      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed response data:', responseData);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        responseData = null;
      }

      if (response.ok) {
        // Update the posts state with the new featured status
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id == postId || post._id == postId) {
              const updatedPost = {
                ...post,
                isFeatured: newFeaturedStatus,
                featured: newFeaturedStatus
              };
              console.log('Updated post data:', updatedPost);
              return updatedPost;
            }
            return post;
          })
        );

        setSuccessMessage(newFeaturedStatus 
          ? "News marked as featured successfully!" 
          : "Featured status removed successfully!"
        );

        // Refresh the posts list to ensure we have the latest data
        setTimeout(async () => {
          console.log('Refreshing posts list...');
          await fetchApprovedPosts();
        }, 1000);
      } else {
        throw new Error(`Server returned status: ${response.status}`);
      }

      // Close dropdown
      toggleActionDropdown(postId);

    } catch (err) {
      console.error('Featured toggle error:', err);
      setError('Failed to update featured status. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Function to handle remove post (delete request)
  const handleRemovePost = async (postId) => {
    try {
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

      // Make DELETE request to remove the post
      await axios.delete(`${baseURL}/api/news/${postId}`, config);
      
      // Update local state to remove the post
      setPosts(prevPosts => prevPosts.filter(post => 
        post.id !== postId && post._id !== postId
      ));

      // Show success message
      setSuccessMessage("Post removed successfully");
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error removing post:', err);
      setError(`Failed to remove post: ${err.message}`);
      
      // Clear the error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  // Toggle action dropdown for a specific post
  const toggleActionDropdown = (postId) => {
    setActionDropdowns(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      // Close action dropdowns when clicking outside
      Object.keys(actionDropdownRefs.current).forEach(postId => {
        if (
          actionDropdownRefs.current[postId] && 
          !actionDropdownRefs.current[postId].contains(event.target)
        ) {
          setActionDropdowns(prev => ({
            ...prev,
            [postId]: false
          }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigate = (path) => {
    setDropdownOpen(false);
    // These would be the paths to your post creation screens
    if (path === 'standard') {
      navigate('/editor/standardPost');
    } else if (path === 'video') {
      navigate('/editor/videoPost');
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      {/* Header section with title and button */}
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
          gap: '10px'
        }}>
          All Approved Posts 
          <span style={{ 
            fontSize: '24px', 
            color: '#6b7280', 
            fontWeight: 'normal'
          }}>
            ({posts.length})
          </span>
        </h1>
        
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaPlus size={16} />
            Add new Post
          </button>
          
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              width: '180px',
              zIndex: 10
            }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => handleNavigate('standard')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FaFileAlt size={16} color="#4f46e5" />
                <span>Standard Post</span>
              </div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => handleNavigate('video')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FaVideo size={16} color="#4f46e5" />
                <span>Video Post</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div style={{ 
          backgroundColor: '#d1fae5', 
          color: '#065f46', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontWeight: 'bold' }}>✓</span> {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '16px' 
        }}>
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          Loading approved posts...
        </div>
      ) : (
        /* Table */
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflowX: 'auto'
        }}>
          {posts.length === 0 ? (
            <div style={{ 
              padding: '24px', 
              textAlign: 'center', 
              color: '#6b7280'
            }}>
              No approved posts found
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
                    Submitted By <span style={{ color: '#9ca3af' }}>↓</span>
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Approved By <span style={{ color: '#9ca3af' }}>↓</span>
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
                    Approved At <span style={{ color: '#9ca3af' }}>↓</span>
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
                {posts.map((post, index) => {
                  const postId = post._id || post.id || `post-${index}`;
                  // Check for either featured or isFeatured property being true
                  const isPostFeatured = post.featured || post.isFeatured;
                  return (
                    <tr key={postId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px', maxWidth: '300px' }}>
                        <div style={{ marginBottom: isPostFeatured ? '5px' : '0' }}>
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
                          >
                            {post.title || post.headline || 'No title'}
                          </Link>
                        </div>
                        {isPostFeatured && (
                          <span style={{ 
                            backgroundColor: '#ecfdf5', 
                            color: '#10b981',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <FaStar size={10} /> FEATURED NEWS
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>{post.category || 'Uncategorized'}</td>
                      <td style={{ padding: '16px' }}>{post.author || post.submittedBy || post.createdBy || 'Unknown'}</td>
                      <td style={{ padding: '16px' }}>{post.approvedBy || 'Unknown'}</td>
                      <td style={{ padding: '16px' }}>{post.createdAt || post.submittedAt || 'Unknown'}</td>
                      <td style={{ padding: '16px' }}>{post.approvedAt || post.updatedAt || 'Unknown'}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ position: 'relative' }}>
                          <button 
                            style={{ 
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#6b7280',
                              padding: '5px'
                            }}
                            aria-label="More options"
                            onClick={() => toggleActionDropdown(postId)}
                          >
                            <FaEllipsisV />
                          </button>
                          
                          {/* Action dropdown menu */}
                          {actionDropdowns[postId] && (
                            <div 
                              ref={el => actionDropdownRefs.current[postId] = el}
                              style={{
                                position: 'absolute',
                                right: '0',
                                top: '100%',
                                backgroundColor: 'white',
                                borderRadius: '6px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                width: '180px',
                                zIndex: 20
                              }}
                            >
                              {/* Mark/Remove Featured Button */}
                              <div 
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  color: isPostFeatured ? '#b91c1c' : '#047857',
                                  borderBottom: '1px solid #e5e7eb',
                                  transition: 'background-color 0.2s'
                                }}
                                onClick={() => toggleFeatured(postId, isPostFeatured)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <FaStar size={16} />
                                <span>{isPostFeatured ? 'Remove Featured' : 'Mark Featured'}</span>
                              </div>
                              
                              {/* Remove Post Button */}
                              <div 
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  color: '#b91c1c',
                                  transition: 'background-color 0.2s'
                                }}
                                onClick={() => handleRemovePost(postId)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <FaTrash size={16} />
                                <span>Remove</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {posts.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                1 to {Math.min(posts.length, 5)} Items of {posts.length} — <Link to="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>View all</Link>
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
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts; 