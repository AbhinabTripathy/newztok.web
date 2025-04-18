import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaEllipsisV, FaFileAlt, FaVideo, FaStar, FaTrash, FaEdit, FaExternalLinkAlt, FaRegStar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatApiUrl, getAuthToken, getAuthConfig } from '../../utils/api';

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
  const baseURL = 'https://api.newztok.in';

  // Helper function to format dates to IST
  const formatToIST = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      // Format to IST (UTC+5:30)
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if formatting fails
    }
  };

  // Fetch approved posts
  useEffect(() => {
    fetchApprovedPosts();
  }, []);

  const fetchApprovedPosts = async () => {
    try {
      setLoading(true);
      
      // Get the auth token
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Configure axios headers with the token
      const config = getAuthConfig();

      // Fetch approved posts with properly formatted URL
      const url = formatApiUrl(baseURL, '/api/news/approved-by-me');
      const response = await axios.get(url, config);
      
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
      
      // Get list of deleted post IDs from localStorage
      let deletedPostIds = [];
      try {
        deletedPostIds = JSON.parse(localStorage.getItem('deletedPosts') || '[]');
      } catch (error) {
        console.warn('Could not parse deleted posts from localStorage:', error);
      }
      
      // Filter out any posts that have been deleted
      fetchedPosts = fetchedPosts.filter(post => {
        const postId = post._id || post.id;
        return !deletedPostIds.includes(postId);
      });
      
      // Log complete post objects to examine structure
      console.log('Complete post objects after filtering deleted posts:', fetchedPosts);
      
      // Set posts with a clean object to ensure reactivity and handle missing properties
      const processedPosts = fetchedPosts.map(post => {
        // More comprehensive check for featured status
        const isFeaturedValue = 
          post.isFeatured === true || 
          post.featured === true || 
          post.is_featured === true ||
          post.isFeatured === 'true' || 
          post.featured === 'true' || 
          post.is_featured === 'true' ||
          post.isFeatured === 1 ||
          post.featured === 1 ||
          post.is_featured === 1;
        
        // Extract journalist information with proper logging for debugging
        let journalistName = 'Unknown';
        const journalistInfo = post.journalist || post.createdBy || post.submittedBy || post.author;
        
        console.log('Journalist info for post', post._id || post.id, ':', journalistInfo);
        
        if (journalistInfo) {
          if (typeof journalistInfo === 'object') {
            if (journalistInfo.name) {
              journalistName = journalistInfo.name;
            } else if (journalistInfo.fullName) {
              journalistName = journalistInfo.fullName;
            } else if (journalistInfo.userName) {
              journalistName = journalistInfo.userName;
            } else if (journalistInfo.username) {
              journalistName = journalistInfo.username;
            } else {
              // If we have an object but no recognizable name property, try to format what we have
              journalistName = `ID: ${journalistInfo.id || 'unknown'}`;
              if (journalistInfo.email) journalistName += ` (${journalistInfo.email})`;
              
              // Log the object for debugging
              console.log('Journalist object without standard name property:', journalistInfo);
            }
          } else if (typeof journalistInfo === 'string') {
            journalistName = journalistInfo;
          }
        }
          
        // Extract editor information with proper logging for debugging
        let editorName = 'Unknown';
        const editorInfo = post.editor || post.approvedBy;
        
        console.log('Editor info for post', post._id || post.id, ':', editorInfo);
        
        if (editorInfo) {
          if (typeof editorInfo === 'object') {
            if (editorInfo.name) {
              editorName = editorInfo.name;
            } else if (editorInfo.fullName) {
              editorName = editorInfo.fullName;
            } else if (editorInfo.userName) {
              editorName = editorInfo.userName;
            } else if (editorInfo.username) {
              editorName = editorInfo.username;
            } else {
              // If we have an object but no recognizable name property, try to format what we have
              editorName = `ID: ${editorInfo.id || 'unknown'}`;
              if (editorInfo.email) editorName += ` (${editorInfo.email})`;
              
              // Log the object for debugging
              console.log('Editor object without standard name property:', editorInfo);
            }
          } else if (typeof editorInfo === 'string') {
            editorName = editorInfo;
          }
        }
        
        // Format dates to IST
        const formattedSubmittedAt = formatToIST(post.createdAt || post.submittedAt);
        const formattedApprovedAt = formatToIST(post.approvedAt || post.updatedAt);
        
        // Log the extracted names for debugging
        console.log(`Post ${post._id || post.id} - Journalist: ${journalistName}, Editor: ${editorName}`);
          
        return {
          ...post,
          // Keep both consistent
          featured: isFeaturedValue,
          isFeatured: isFeaturedValue,
          // Store journalist and editor info
          journalistName,
          editorName,
          // Store formatted dates
          formattedSubmittedAt,
          formattedApprovedAt
        };
      });
      
      // Sort by most recently approved first
      const sortedPosts = processedPosts.sort((a, b) => {
        const dateA = new Date(a.approvedAt || a.updatedAt || 0);
        const dateB = new Date(b.approvedAt || b.updatedAt || 0);
        return dateB - dateA; // Descending order (newest first)
      });
      
      setPosts(sortedPosts);
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
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Check if we're trying to mark a post as featured (not unfeature it)
      if (!currentFeatured) {
        // First, check if the token already indicates this post is featured
        // We do this by checking local storage or any other token storage mechanism
        try {
          const storedFeaturedKey = `featured_post_${postId}`;
          const storedFeatured = localStorage.getItem(storedFeaturedKey);
          
          // If we already have a stored token for this post being featured,
          // we can update the UI immediately without making an API call
          if (storedFeatured === 'true') {
            console.log(`Post ${postId} already marked as featured in local storage`);
            
            // Update UI state only
            updatePostFeaturedState(postId, true);
            return;
          }
        } catch (storageError) {
          // If localStorage access fails, continue with API call
          console.warn('Could not access localStorage:', storageError);
        }
      }

      // Setup headers with the token
      const config = getAuthConfig();

      // Create request body - explicitly setting the new status
      const newFeaturedStatus = !currentFeatured;
      const requestBody = {
        isFeatured: newFeaturedStatus
      };
      console.log('Request body:', requestBody);

      // Setup and make the request
      const endpoint = formatApiUrl(baseURL, `/api/news/featured/${postId}`);
      console.log('Making request to:', endpoint);

      // Make the PUT request using axios
      const response = await axios.put(endpoint, requestBody, config);
      console.log('Response data:', response.data);

      if (response.status >= 200 && response.status < 300) {
        // If successfully marked as featured, store this information
        if (newFeaturedStatus) {
          try {
            localStorage.setItem(`featured_post_${postId}`, 'true');
          } catch (storageError) {
            console.warn('Could not store featured state in localStorage:', storageError);
          }
        } else {
          // If unfeatured, remove the local storage token
          try {
            localStorage.removeItem(`featured_post_${postId}`);
          } catch (storageError) {
            console.warn('Could not remove featured state from localStorage:', storageError);
          }
        }

        // Update post state with the new featured status
        updatePostFeaturedState(postId, newFeaturedStatus);
      } else {
        throw new Error(`Server returned status: ${response.status}`);
      }

    } catch (err) {
      console.error('Featured toggle error:', err);
      setError('Failed to update featured status. Please try again.');
      setTimeout(() => setError(null), 3000);
      
      // Close dropdown in case of error too
      toggleActionDropdown(postId);
    }
  };

  // Helper function to update featured state in UI
  const updatePostFeaturedState = (postId, newFeaturedStatus) => {
    // Update the posts state with the new featured status
    setPosts(prevPosts => 
      prevPosts.map(post => {
        // Verify the ID match more strictly with string conversion
        if (String(post.id) === String(postId) || String(post._id) === String(postId)) {
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

    // Don't automatically refresh - it's losing our state
    // Instead, close the dropdown and let the current state persist
    toggleActionDropdown(postId);
  };

  // Function to handle remove post (delete request)
  const handleRemovePost = async (postId) => {
    try {
      // Confirm with the user before deleting
      if (!window.confirm('Are you sure you want to permanently delete this post? This action cannot be undone.')) {
        return;
      }

      console.log("Trying to delete post:", postId);
      const token = getAuthToken();
      const res = await axios.delete(`https://api.newztok.in/api/news/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete successful:", res.data);
      
      // Handle successful deletion
      handleSuccessfulDeletion(postId);
      
    } catch (error) {
      console.error("Error deleting post:", error);
      setError('Failed to delete post. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Helper function to handle successful deletion
  const handleSuccessfulDeletion = (postId) => {
    // Remove the post from the local state
    setPosts(prevPosts => prevPosts.filter(post => 
      String(post.id) !== String(postId) && String(post._id) !== String(postId)
    ));
    
    // Store the deleted post ID in localStorage to prevent it from reappearing
    try {
      const deletedPosts = JSON.parse(localStorage.getItem('deletedPosts') || '[]');
      if (!deletedPosts.includes(postId)) {
        deletedPosts.push(postId);
        localStorage.setItem('deletedPosts', JSON.stringify(deletedPosts));
      }
    } catch (storageError) {
      console.warn('Could not store deleted post ID in localStorage:', storageError);
    }
    
    setSuccessMessage("Post permanently deleted from the database");
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
    
    // Close the dropdown
    toggleActionDropdown(postId);
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
                      <td style={{ padding: '16px' }}>
                        {/* Show the journalist information */}
                        {post.journalist && typeof post.journalist === 'object' ? 
                          post.journalist.username || post.journalist.name || `ID: ${post.journalist.id}` 
                          : 
                          post.journalistName || post.author || post.submittedBy || post.createdBy || 'Unknown'
                        }
                      </td>
                      <td style={{ padding: '16px' }}>
                        {/* Show the editor information */}
                        {post.editor && typeof post.editor === 'object' ? 
                          post.editor.username || post.editor.name || `ID: ${post.editor.id}` 
                          : 
                          post.editorName || post.approvedBy || 'Unknown'
                        }
                      </td>
                      <td style={{ padding: '16px' }}>{post.formattedSubmittedAt}</td>
                      <td style={{ padding: '16px' }}>{post.formattedApprovedAt}</td>
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