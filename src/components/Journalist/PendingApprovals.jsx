import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiEdit, FiX } from 'react-icons/fi';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';

const PendingApprovals = () => {
  const [pendingNews, setPendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editState, setEditState] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editorKey, setEditorKey] = useState(Date.now());
  const [editorRef, setEditorRef] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Add getAuthToken function
  const getAuthToken = () => {
    // Get token from all possible storage locations with fallbacks
    const storageOptions = [localStorage, sessionStorage];
    const tokenKeys = ['authToken', 'token', 'jwtToken', 'userToken', 'accessToken'];
    
    for (const storage of storageOptions) {
      for (const key of tokenKeys) {
        const token = storage.getItem(key);
        if (token) {
          console.log(`Found token with key '${key}'`);
          return token;
        }
      }
    }
    
    console.error('No authentication token found');
    return null;
  };

  // Add mock data generator
  const getMockPendingNews = () => {
    return [
      { 
        id: 'mock-p1', 
        title: 'Breaking News: New Development in Local Politics', 
        content: '<p>This is a mock article about local politics.</p>', 
        category: 'Politics',
        district: 'Delhi',
        status: 'pending', 
        createdAt: new Date().toISOString() 
      },
      { 
        id: 'mock-p2', 
        title: 'Sports Update: Championship Finals Scheduled', 
        content: '<p>Local sports team heading to the finals.</p>', 
        category: 'Sports',
        district: 'Mumbai',
        status: 'pending', 
        createdAt: new Date().toISOString() 
      },
      { 
        id: 'mock-p3', 
        title: 'Economic Forecast Shows Growth for Next Quarter', 
        content: '<p>Financial analysts predict economic upturn.</p>', 
        category: 'Business',
        district: 'Bengaluru',
        status: 'pending', 
        createdAt: new Date().toISOString() 
      }
    ];
  };

  const fetchPendingNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get auth token
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Configure headers with token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Fetching pending posts from API with token');
      // Using the correct working URL
      const response = await axios.get(`http://13.234.42.114:3333/api/news/my-pending-news`, config);
      
      console.log('API Response:', response.data);
      
      // Handle different response formats
      let newsItems = [];
      if (Array.isArray(response.data)) {
        newsItems = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        newsItems = response.data.data;
      }
      
      // Set total results for pagination if available
      if (response.data && response.data.total) {
        setTotalResults(response.data.total);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setTotalResults(newsItems.length);
        setTotalPages(Math.ceil(newsItems.length / itemsPerPage));
      }
      
      console.log('Fetched pending news items:', newsItems.length);
      
      // Check for any locally updated news items in localStorage
      const updatedItems = checkForLocallyUpdatedItems(newsItems);
      
      setPendingNews(updatedItems);
      
      // Cache the result for future use
      try {
        localStorage.setItem('cached_pending_news', JSON.stringify(updatedItems));
      } catch (cacheError) {
        console.warn('Failed to cache pending news:', cacheError);
      }
      
    } catch (err) {
      console.error('Error fetching pending news:', err);
      setError('Failed to fetch pending posts. Using demo data instead.');
      
      // Try to load from cache first
      try {
        const cachedData = localStorage.getItem('cached_pending_news');
        if (cachedData) {
          console.log('Using cached pending news data');
          const parsedData = JSON.parse(cachedData);
          
          // Even when using cached data, check for local updates
          const updatedItems = checkForLocallyUpdatedItems(parsedData);
          
          setPendingNews(updatedItems);
          return;
        }
      } catch (cacheError) {
        console.warn('Error reading from cache:', cacheError);
      }
      
      // Fall back to mock data if API call fails and no cache
      console.log('Using mock data as fallback');
      const mockData = getMockPendingNews();
      
      // Check for locally updated items in mock data too
      const updatedMockItems = checkForLocallyUpdatedItems(mockData);
      
      setPendingNews(updatedMockItems);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to check if any news items have been updated locally
  const checkForLocallyUpdatedItems = (newsItems) => {
    if (!newsItems || !Array.isArray(newsItems)) return newsItems;
    
    return newsItems.map(item => {
      // Check if we have a locally updated version of this item
      try {
        const localItemKey = `updatedNewsItem_${item.id}`;
        const localItemJson = localStorage.getItem(localItemKey);
        
        if (localItemJson) {
          const localItem = JSON.parse(localItemJson);
          
          // Check if the local update is newer than our current data
          if (localItem && localItem.updatedAt) {
            console.log(`Found locally updated version of item ${item.id}`);
            
            // Merge the local item with the API item, keeping the API's status and other fields
            // that shouldn't be changed locally
            return {
              ...item,
              title: localItem.title || item.title,
              content: localItem.content || item.content,
              category: localItem.category || item.category,
              state: localItem.state || item.state, 
              district: localItem.district || item.district,
              featuredImage: localItem.featuredImage || item.featuredImage,
              _updatedLocally: true // Add flag to indicate this was updated locally
            };
          }
        }
      } catch (err) {
        console.warn(`Error checking for local updates for item ${item.id}:`, err);
      }
      
      return item;
    });
  };

  const fetchNewsById = async (newsId) => {
    try {
      console.log(`Starting fetch for news ID ${newsId}`);
      
      // IMPORTANT: First find the news item in our existing data - this is our main source of truth
      const existingNewsItem = pendingNews.find(news => news.id === newsId || news.id === parseInt(newsId));
      
      if (!existingNewsItem) {
        console.error(`News item with ID ${newsId} not found in existing data`);
        return null;
      }
      
      console.log(`Found news item with ID ${newsId} in existing data:`, existingNewsItem);
      
      // Create a clean copy of existing data with default values for critical fields
      const workingCopy = { 
        ...existingNewsItem,
        // Ensure these fields have fallback values and are never null
        featuredImage: existingNewsItem.featuredImage || '',
        state: existingNewsItem.state || '',
        district: existingNewsItem.district || '',
        category: existingNewsItem.category || ''
      };
      
      console.log("Working with data (defaults applied):", workingCopy);
      
      // Get the auth token from localStorage or sessionStorage
      const token = getAuthToken();
      
      // If no token, just return the existing data we have
      if (!token) {
        console.log('No authentication token found, using existing data');
        return workingCopy;
      }

      // Configure axios headers with the token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      console.log(`Attempting to fetch news with ID ${newsId}`);
      
      // Updated endpoint list based on user's requirements
      const endpoints = [
        // Primary endpoint should be /api/news/pending as specified by the user
        `http://13.234.42.114:3333/api/news/pending/${newsId}`,
        
        // Fallback endpoints
        `http://13.234.42.114:3333/api/news/${newsId}`,
        `http://13.234.42.114:3333/api/news/pending-news/${newsId}`,
        `http://13.234.42.114:3333/api/news/detail/${newsId}`,
        `http://13.234.42.114:3333/api/news/view/${newsId}`,
        `http://13.234.42.114:3333/api/news/get/${newsId}`
      ];
      
      let apiData = null;
      let successfulEndpoint = null;
      
      // Try each endpoint
      for (const endpoint of endpoints) {
        if (apiData) break; // Stop if we already found data
        
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await axios.get(endpoint, config);
          
          if (response.status === 200 && response.data) {
            console.log('News details response:', response.data);
            const newsData = response.data.data || response.data;
            
            // If data has an id, it's likely a valid news object
            if (newsData && (newsData.id || newsData.title)) {
              console.log('Found valid news data from API');
              apiData = newsData;
              successfulEndpoint = endpoint;
              break;
            }
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed: ${error.message}`);
          // Continue to next endpoint
        }
      }
      
      // Log the successful endpoint for future reference
      if (successfulEndpoint) {
        console.log(`Successfully fetched data from endpoint: ${successfulEndpoint}`);
        // You might want to store this info somewhere for future use
      }
      
      // If we got API data, merge it with our existing data
      if (apiData) {
        console.log('Merging API data with existing data');
        
        // Log specific fields to debug
        console.log('API returned category:', apiData.category);
        console.log('API returned state:', apiData.state);
        console.log('API returned district:', apiData.district);
        console.log('API returned featuredImage:', apiData.featuredImage);
        
        // Handle null values from the API - never overwrite existing values with null
        // Replace null values with existing values or empty strings
        const safeApiData = {
          ...apiData,
          featuredImage: apiData.featuredImage || workingCopy.featuredImage || '',
          state: apiData.state || workingCopy.state || '',
          district: apiData.district || workingCopy.district || '',
          category: apiData.category || workingCopy.category || ''
        };
        
        // Create the result with merged data, prioritizing API data for certain fields
        // but never using null values from the API
        return {
          ...workingCopy,
          ...safeApiData,
          // Explicitly set these fields with a preference for API values (if not null)
          title: safeApiData.title || workingCopy.title || '',
          content: safeApiData.content || workingCopy.content || '',
          category: safeApiData.category || workingCopy.category || '',
          state: safeApiData.state || workingCopy.state || '',
          district: safeApiData.district || workingCopy.district || '',
          // Make sure featuredImage is always present and never null
          featuredImage: safeApiData.featuredImage || workingCopy.featuredImage || ''
        };
      }
      
      // If all API calls fail, use the existing data
      console.log('All API endpoints failed, using existing data only');
      
      // Make sure we're working with all fields populated
      workingCopy.title = workingCopy.title || '';
      workingCopy.content = workingCopy.content || '';
      workingCopy.category = workingCopy.category || '';
      workingCopy.state = workingCopy.state || '';
      workingCopy.district = workingCopy.district || '';
      workingCopy.featuredImage = workingCopy.featuredImage || '';
      
      return workingCopy;
      
    } catch (err) {
      console.error(`Error in fetchNewsById for ID ${newsId}:`, err);
      // Find and return the news item from our existing data
      const existingNewsItem = pendingNews.find(news => news.id === newsId || news.id === parseInt(newsId));
      if (existingNewsItem) {
        console.log('Using existing data as fallback after error');
        return { 
          ...existingNewsItem,
          // Ensure these fields have fallback values
          featuredImage: existingNewsItem.featuredImage || '',
          state: existingNewsItem.state || '',
          district: existingNewsItem.district || '',
          category: existingNewsItem.category || ''
        };
      }
      
      // Absolute last resort - create an empty object with the ID
      return { 
        id: newsId,
        title: '', 
        content: '',
        category: '',
        state: '',
        district: '',
        featuredImage: ''
      };
    }
  };

  useEffect(() => {
    fetchPendingNews();
    
    // Add event listener to refresh data when user navigates back to this page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, refreshing data...');
        fetchPendingNews();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Check for refresh flag set by EditPost component
    const refreshFlag = localStorage.getItem('pendingApprovals_refresh');
    if (refreshFlag === 'true') {
      console.log('Refresh flag detected, fetching fresh data');
      fetchPendingNews();
      localStorage.removeItem('pendingApprovals_refresh');
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Function to truncate and sanitize HTML content for display
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + '...' : textContent;
  };

  // Function to get a safe HTML preview
  const getContentPreview = (htmlContent) => {
    if (!htmlContent) return 'No content available';
    
    // First get plain text for truncation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Truncate the plain text
    const truncated = textContent.length > 80 ? textContent.substring(0, 80) + '...' : textContent;
    
    // Return the plain text (no HTML rendering)
    return truncated;
  };

  // Function to render HTML content safely
  const renderHTML = (html) => {
    return { __html: html };
  };

  const handleEditClick = (news) => {
    try {
      console.log("Redirecting to edit screen for news ID:", news.id);
      
      // Instead of storing the full news object, just store the ID
      // The EditPost component will fetch the complete data using this ID
      localStorage.setItem('editNewsId', news.id);
      
      // Redirect to the edit screen with the news ID in the URL
      navigate(`/journalist/edit-post/${news.id}`);
    } catch (error) {
      console.error("Error redirecting to edit screen:", error);
      setError("Failed to navigate to edit screen. Please try again.");
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        color: '#111827', 
        marginBottom: '24px' 
      }}>
        Pending Approval
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
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading pending news...</div>
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
            gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr 0.5fr', 
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
              District <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
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
              Status <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
            </div>
            <div style={{ 
              color: '#374151', 
              fontWeight: '500', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px'
            }}>
              Action
            </div>
          </div>

          {pendingNews.length === 0 ? (
            /* Empty State */
            <div style={{ 
              padding: '24px 16px',
              textAlign: 'center',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: 'white'
            }}>
              No posts available for approval.
            </div>
          ) : (
            /* News Items */
            pendingNews.map((news, index) => (
              <div 
                key={news.id || index}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr 0.5fr', 
                  borderBottom: index < pendingNews.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: news._updatedLocally ? '#f0f9ff' : 'white' // Highlight locally updated items
                }}
              >
                <div style={{ 
                  padding: '16px', 
                  borderRight: '1px solid #e5e7eb',
                  color: '#1f2937'
                }}>
                  {news.title || 'No title'}
                  {news._updatedLocally && (
                    <span style={{
                      fontSize: '11px',
                      color: '#2563eb',
                      marginLeft: '5px',
                      fontWeight: 'bold'
                    }}>
                      (edited)
                    </span>
                  )}
                </div>
                <div style={{ 
                  padding: '16px', 
                  borderRight: '1px solid #e5e7eb',
                  color: '#1f2937'
                }}>
                  {getContentPreview(news.content)}
                </div>
                <div style={{ 
                  padding: '16px', 
                  borderRight: '1px solid #e5e7eb',
                  color: '#1f2937'
                }}>
                  {news.category || 'Uncategorized'}
                </div>
                <div style={{ 
                  padding: '16px', 
                  borderRight: '1px solid #e5e7eb',
                  color: '#1f2937'
                }}>
                  {news.district || 'N/A'}
                </div>
                <div style={{ 
                  padding: '16px',
                  color: '#1f2937',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}>
                  <span style={{
                    backgroundColor: '#FEF3C7',
                    color: '#D97706',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {news.status || 'Pending'}
                  </span>
                </div>
                <div style={{ 
                  padding: '16px',
                  color: '#1f2937',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <button
                    style={{
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s'
                    }}
                    title="Edit news post"
                    onClick={() => handleEditClick(news)}
                  >
                    <FiEdit size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && pendingNews.length > 0 && (
        /* Pagination */
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <div>
            1 to {pendingNews.length} Items of {totalResults} — 
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

export default PendingApprovals; 