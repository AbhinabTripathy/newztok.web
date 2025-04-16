import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import axios from 'axios';

const JournalistPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get auth token from storage
  const getAuthToken = () => {
    // Check all possible storage locations for the token
    const storageLocations = [localStorage, sessionStorage];
    // Use the same key order as other components for consistency
    const possibleKeys = ['authToken', 'token', 'jwtToken', 'userToken', 'accessToken'];
    
    for (const storage of storageLocations) {
      for (const key of possibleKeys) {
        const token = storage.getItem(key);
        if (token) {
          console.log(`Found token with key '${key}' in ${storage === localStorage ? 'localStorage' : 'sessionStorage'}`);
          return token;
        }
      }
    }
    
    console.error('No authentication token found');
    return null;
  };

  useEffect(() => {
    const fetchJournalistPosts = async () => {
      try {
        setLoading(true);
        
        // Get the auth token
        const token = getAuthToken();
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Configure axios headers with the token
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        console.log('Making API request to fetch approved posts');

        // Fetch journalist's approved posts using the specified endpoint
        const response = await axios.get('https://api.newztok.in/api/news/my-approved-news', config);
        
        console.log('Approved posts raw response:', response);
        console.log('Approved posts response data:', response.data);
        
        // Update the posts array
        if (response.data && response.data.data) {
          console.log('Setting posts from API data:', response.data.data);
          setPosts(response.data.data);
        } else if (Array.isArray(response.data)) {
          console.log('Setting posts from API data array:', response.data);
          setPosts(response.data);
        } else {
          console.log('No data found in API response');
          setError('No approved posts received from the server');
        }

      } catch (err) {
        console.error('Error fetching journalist approved posts:', err);
        setError(`Failed to load approved posts: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchJournalistPosts();
  }, []);

  // Function to get status color
  const getStatusColor = (status) => {
    if (!status) return { bg: '#f3f4f6', text: '#6b7280' };
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('pend') || statusLower === 'waiting') {
      return { bg: '#FEF3C7', text: '#FDB62D' };
    } else if (statusLower.includes('approve') || statusLower === 'published') {
      return { bg: '#DEF7EC', text: '#10B981' };
    } else if (statusLower.includes('reject') || statusLower === 'declined') {
      return { bg: '#FEE2E2', text: '#EF4444' };
    }
    
    return { bg: '#f3f4f6', text: '#6b7280' };
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        color: '#111827', 
        marginBottom: '24px' 
      }}>
        My Approved Posts
      </h1>

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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading approved posts...</div>
      ) : (
        /* Table */
        <div style={{ 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '16px'
        }}>
          {/* Table Headers */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', 
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <div style={{ 
              color: '#374151', 
              fontWeight: '500', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderRight: '1px solid #e5e7eb'
            }}>
              Headline <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
            </div>
            <div style={{ 
              color: '#374151', 
              fontWeight: '500', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderRight: '1px solid #e5e7eb'
            }}>
              Content <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
            </div>
            <div style={{ 
              color: '#374151', 
              fontWeight: '500', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderRight: '1px solid #e5e7eb'
            }}>
              Category <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
            </div>
            <div style={{ 
              color: '#374151', 
              fontWeight: '500', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderRight: '1px solid #e5e7eb'
            }}>
              State <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
            </div>
            <div style={{ 
              color: '#374151', 
              fontWeight: '500', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderRight: '1px solid #e5e7eb'
            }}>
              District <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
            </div>
            <div style={{ 
              color: '#374151', 
              fontWeight: '500', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px'
            }}>
              Status <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
            </div>
          </div>

          {posts.length === 0 ? (
            /* Empty State */
            <div style={{ 
              padding: '24px 16px',
              textAlign: 'center',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: 'white'
            }}>
              No approved posts available yet.
            </div>
          ) : (
            /* Posts Items */
            posts.map((post, index) => {
              console.log('Rendering post:', post);
              const statusStyle = getStatusColor(post.status);
              
              return (
                <div 
                  key={post.id || index}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', 
                    borderBottom: index < posts.length - 1 ? '1px solid #e5e7eb' : 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <div style={{ 
                    padding: '16px', 
                    borderRight: '1px solid #e5e7eb',
                    color: '#1f2937'
                  }}>
                    {post.title || 'No title'}
                  </div>
                  <div style={{ 
                    padding: '16px', 
                    borderRight: '1px solid #e5e7eb',
                    color: '#1f2937',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {/* Safely extract plain text from HTML content */}
                    {post.content ? (document.createElement('div').innerHTML = post.content, 
                      document.createElement('div').textContent.substring(0, 80) + '...') : 
                      (post.excerpt || post.summary || 'No content available')}
                  </div>
                  <div style={{ 
                    padding: '16px', 
                    borderRight: '1px solid #e5e7eb',
                    color: '#1f2937'
                  }}>
                    {post.category || 'Uncategorized'}
                  </div>
                  <div style={{ 
                    padding: '16px', 
                    borderRight: '1px solid #e5e7eb',
                    color: '#1f2937'
                  }}>
                    {post.state || 'N/A'}
                  </div>
                  <div style={{ 
                    padding: '16px', 
                    borderRight: '1px solid #e5e7eb',
                    color: '#1f2937'
                  }}>
                    {post.district || 'N/A'}
                  </div>
                  <div style={{ 
                    padding: '16px',
                    color: '#1f2937'
                  }}>
                    <span style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.text,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {post.status || 'Approved'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {!loading && posts.length > 0 && (
        /* Pagination */
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <div>
            1 to {posts.length} Items of {posts.length} — 
            <button style={{ 
              color: '#4f46e5', 
              backgroundColor: 'transparent', 
              border: 'none', 
              padding: '0 4px', 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: '500'
            }}>
              View all <HiOutlineArrowNarrowRight style={{ marginLeft: '4px' }} />
            </button>
          </div>
          
          {/* Pagination Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ 
              padding: '8px 16px', 
              backgroundColor: '#e5edff', 
              color: '#4f46e5', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Previous
            </button>
            <button style={{ 
              padding: '8px 16px', 
              backgroundColor: '#e5edff', 
              color: '#4f46e5', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalistPost; 