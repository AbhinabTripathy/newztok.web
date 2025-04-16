import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiEdit } from 'react-icons/fi';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import './editor.css';
import { useNavigate, Link } from 'react-router-dom';

// CSS for spinner animation
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PendingApprovals = () => {
  const [pendingNews, setPendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isVideoContent, setIsVideoContent] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const navigate = useNavigate();
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const baseURL = 'https://api.newztok.in';

  useEffect(() => {
    console.log('PendingApprovals component mounted at:', new Date().toISOString());
    console.log('Starting to fetch pending news...');
    fetchPendingNews();
    
    return () => {
      console.log('PendingApprovals component unmounting');
    };
  }, []);

  const getAuthToken = () => {
    // Get token from all possible storage locations with fallbacks
    const storageOptions = [localStorage, sessionStorage];
    const tokenKeys = ['authToken', 'token', 'jwtToken', 'userToken', 'accessToken'];
    
    for (const storage of storageOptions) {
      for (const key of tokenKeys) {
        const token = storage.getItem(key);
        if (token) {
          console.log(`Found token with key '${key}'`);
          try {
            // Ensure token is properly formatted and not wrapped in quotes
            const cleanToken = token.trim().replace(/^["'](.*)["']$/, '$1');
            // Verify the token looks like a JWT (crude validation)
            if (cleanToken.split('.').length === 3) {
              return cleanToken;
            } else {
              console.warn('Token found but does not appear to be a valid JWT format');
            }
          } catch (e) {
            console.error('Error parsing token:', e);
          }
          return token;
        }
      }
    }
    
    console.error('No authentication token found');
    return null;
  };

  const fetchPendingNews = async (retryCount = 0, delay = 1000) => {
    setLoading(true);
    setError(null);
    const endpointsToTry = [
      `${baseURL}/api/news/pending`,
      `${baseURL}/api/news?status=pending`,
      `${baseURL}/api/posts/pending`
    ];
    let isDemoMode = false;
    
    try {
      // Get auth token with better validation
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not found - please login again');
      }
      
      // Log token format for debugging (safely)
      console.log('Token length:', token.length);
      console.log('Token format check:', token.includes('.') ? 'Contains periods (likely JWT)' : 'No periods (may not be JWT)');
      console.log('Token prefix:', token.substring(0, 10) + '...');
      
      // Clean the token - remove any quotes or whitespace that might cause issues
      const cleanToken = token.trim().replace(/^["'](.*)["']$/, '$1');
      
      // Set up headers with clean token
      console.log('Setting up request with cleaned token');
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${cleanToken}`);
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Accept", "application/json");
      
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      };
      
      let responseReceived = false;
      let lastError = null;
      
      // Try each endpoint in sequence
      for (let i = 0; i < endpointsToTry.length; i++) {
        const endpoint = endpointsToTry[i];
        console.log(`Trying endpoint ${i+1}/${endpointsToTry.length}: ${endpoint}`);
        
        try {
          const response = await fetch(endpoint, requestOptions);
          console.log(`Response from ${endpoint}: status ${response.status}`);
          
          // Handle successful response
          if (response.ok) {
            const textData = await response.text();
            console.log(`Received data from ${endpoint}: ${textData.substring(0, 100)}...`);
            
            if (!textData || textData.trim() === '') {
              console.warn(`Empty response from ${endpoint}, trying next endpoint`);
              continue;
            }
            
            try {
              const responseData = JSON.parse(textData);
              
              // Process the successful response data
              let newsItems = [];
              if (Array.isArray(responseData)) {
                newsItems = responseData;
              } else if (responseData && Array.isArray(responseData.data)) {
                newsItems = responseData.data;
              } else if (responseData && typeof responseData === 'object') {
                const possibleArrays = Object.values(responseData)
                  .filter(val => Array.isArray(val) && val.length > 0);
                
                if (possibleArrays.length > 0) {
                  newsItems = possibleArrays[0];
                } else if (responseData.id || responseData.title) {
                  newsItems = [responseData]; // Single item response
                }
              }
              
              console.log(`Successfully processed ${newsItems.length} news items from ${endpoint}`);
              setPendingNews(newsItems);
              setLastFetchTime(new Date().toISOString());
              responseReceived = true;
              break; // Exit the loop on success
            } catch (jsonError) {
              console.error(`Error parsing JSON from ${endpoint}:`, jsonError);
              console.error("Raw text received:", textData.substring(0, 300));
              lastError = new Error(`Invalid response format from ${endpoint}`);
              continue; // Try next endpoint
            }
          }
          
          // Handle 404 specifically
          if (response.status === 404) {
            console.warn(`Endpoint ${endpoint} returned 404, trying next endpoint`);
            continue;
          }
          
          // Handle 500 errors
          if (response.status === 500) {
            let errorBody = '';
            try {
              errorBody = await response.text();
              console.error(`Server error (500) from ${endpoint}:`, errorBody.substring(0, 200));
            } catch (e) {
              console.error(`Could not read error response body from ${endpoint}`);
            }
            
            lastError = new Error(`Server error (500) from ${endpoint}`);
            continue; // Try next endpoint
          }
          
          // Handle other non-OK responses
          lastError = new Error(`HTTP error ${response.status} from ${endpoint}`);
          continue; // Try next endpoint
        } catch (fetchError) {
          console.error(`Network error with ${endpoint}:`, fetchError);
          lastError = fetchError;
          continue; // Try next endpoint
        }
      }
      
      // If all endpoints failed and we're not in retry mode yet
      if (!responseReceived && retryCount < 2) {
        console.log(`All endpoints failed, retrying in ${delay}ms... (Attempt ${retryCount + 1}/2)`);
        
        // Show a temporary message
        setError(
          <div style={{ 
            backgroundColor: '#fff7ed', 
            color: '#c2410c', 
            padding: '12px', 
            borderRadius: '4px' 
          }}>
            <div style={{fontWeight: 'bold', marginBottom: '4px'}}>Server Error</div>
            <div>All API endpoints are temporarily unavailable. Retrying in {delay/1000} seconds...</div>
            <div style={{marginTop: '8px', fontSize: '13px'}}>
              <strong>Status:</strong> Retry attempt {retryCount + 1}/2
            </div>
          </div>
        );
        
        // Wait for the delay before retrying
        setTimeout(() => {
          // Exponential backoff: double the delay for next retry
          fetchPendingNews(retryCount + 1, delay * 2);
        }, delay);
        
        return;
      }
      
      // If we've tried all endpoints and all retries and still failed, use mock data
      if (!responseReceived) {
        console.warn("All endpoints and retries failed. Switching to demo mode with mock data.");
        isDemoMode = true;
        
        // Create mock data for testing/demo mode
        const mockPendingNews = [
          {
            id: "mock-001",
            title: "भारत और ऑस्ट्रेलिया के बीच वनडे सीरीज का आगाज कल से",
            content: "<p>नई दिल्ली: भारत और ऑस्ट्रेलिया के बीच तीन मैचों की वनडे सीरीज का पहला मैच कल मोहाली में खेला जाएगा। सीरीज के बाकी मैच इंदौर और राजकोट में होंगे।</p>",
            category: "sports",
            state: "bihar",
            district: "patna",
            status: "pending",
            createdAt: new Date().toISOString(),
            featuredImage: "https://picsum.photos/800/400"
          },
          {
            id: "mock-002",
            title: "राज्य में नई शिक्षा नीति लागू, छात्रों को मिलेंगे कई लाभ",
            content: "<p>पटना: बिहार सरकार ने राज्य में नई शिक्षा नीति को लागू करने की घोषणा की है। इस नीति के तहत छात्रों को कई नए लाभ मिलेंगे और शिक्षा प्रणाली में सुधार होगा।</p>",
            category: "education",
            state: "bihar",
            district: "gaya",
            status: "pending",
            createdAt: new Date().toISOString(),
            featuredImage: "https://picsum.photos/800/401"
          },
          {
            id: "mock-003",
            title: "वैश्विक महामारी के बाद पर्यटन क्षेत्र में आई तेजी",
            content: "<p>रांची: कोविड-19 महामारी के बाद झारखंड में पर्यटन क्षेत्र में तेजी आई है। राज्य के प्रमुख पर्यटन स्थलों पर पर्यटकों की संख्या में वृद्धि देखी गई है।</p>",
            category: "trending",
            state: "jharkhand",
            district: "ranchi",
            status: "pending",
            createdAt: new Date().toISOString(),
            featuredImage: "https://picsum.photos/800/402"
          }
        ];
        
        setPendingNews(mockPendingNews);
        setLastFetchTime(new Date().toISOString());
        
        // Show demo mode banner
        setError(
          <div style={{ 
            backgroundColor: '#e0f2fe', 
            color: '#0369a1', 
            padding: '12px', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: '#0ea5e9',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              DEMO MODE
            </div>
            <div>
              <div style={{fontWeight: 'bold', marginBottom: '4px'}}>Using sample data</div>
              <div style={{fontSize: '14px'}}>
                API server appears to be down. Showing mock data for testing purposes.
              </div>
            </div>
            <button 
              onClick={() => fetchPendingNews(0, 1000)}
              style={{
                marginLeft: 'auto',
                padding: '6px 12px',
                backgroundColor: '#0284c7',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Try Again
            </button>
          </div>
        );
      }
      
    } catch (err) {
      console.error('Error in fetchPendingNews:', err);
      
      // Set empty array to prevent undefined errors
      setPendingNews([]);
      
      // Try to login again if token error
      if (err.message && err.message.includes('401')) {
        setError('Your session has expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }
      
      // Handle specific 500 error case
      const is500Error = err.message && err.message.includes('500');
      
      // Show a detailed error message
      setError(
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '16px', 
          borderRadius: '4px' 
        }}>
          <div style={{fontWeight: 'bold', marginBottom: '8px', fontSize: '16px'}}>
            Server Error Detected
          </div>
          <div style={{marginBottom: '12px'}}>
            {is500Error ? 
              "The server is currently experiencing issues. This is not a problem with your device or connection." : 
              `Could not connect to API endpoint. Error: ${err.message}`
            }
          </div>
          <div style={{fontSize: '14px', marginBottom: '12px'}}>
            <strong>What you can do:</strong>
            <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
              <li>Wait a few minutes and try again</li>
              <li>Contact the administrator if the problem persists</li>
              <li>Check if server maintenance is scheduled</li>
            </ul>
          </div>
          <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
            <button 
              onClick={() => fetchPendingNews(0, 1000)} // Reset retry count when manually retrying
              style={{
                padding: '6px 12px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Retry Connection
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Reload Page
            </button>
          </div>
          {is500Error && (
            <div style={{marginTop: '16px', fontSize: '13px', color: '#ef4444', backgroundColor: '#fef2f2', padding: '8px', borderRadius: '4px'}}>
              <strong>Error Details:</strong> Internal Server Error (500) - The server encountered an unexpected condition that prevented it from fulfilling the request.
            </div>
          )}
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to handle approval or rejection of news
  const handleStatusUpdate = async (newsId, status) => {
    try {
      // Set loading state
      if (status === 'approved') setApproving(true);
      if (status === 'rejected') setRejecting(true);
      
      // Regular API call 
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not found - please login again');
      }
      
      // Configure headers with token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log(`Updating post ${newsId} status to: ${status}`);
      
      // Prepare payload
      const payload = { status };
      if (status === 'rejected') {
        payload.rejectionReason = 'Content does not meet our editorial standards';
      }
      
      // Use the exact endpoint
      const endpoint = `${baseURL}/api/news/${newsId}/status`;
      console.log(`Sending status update to: ${endpoint}`);
      
      // Send the request
      const response = await axios.put(endpoint, payload, config);
      
      console.log(`Status update successful:`, response.data);
      
      // Update the news item locally to remove it from the list
      setPendingNews(prevNews => 
        prevNews.filter(news => news.id !== newsId)
      );
      
      // Show success message
      setSuccessMessage(`Post ${status} successfully`);
      
      // Refresh data after a brief delay
      setTimeout(() => {
        fetchPendingNews();
        setSuccessMessage(null);
      }, 1500);
      
    } catch (err) {
      console.error(`Error updating news status:`, err);
      
      // Show detailed error information
      if (err.response) {
        console.error('Server Error Details:', {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        });
        setError(`Status update failed (${err.response.status}): ${JSON.stringify(err.response.data)}`);
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      // Reset loading state
      if (status === 'approved') setApproving(false);
      if (status === 'rejected') setRejecting(false);
    }
  };

  // Function to handle edit action
  const handleEdit = (newsId) => {
    // Find the news item from the existing pendingNews array
    const newsToEdit = pendingNews.find(news => news.id === newsId);
    if (newsToEdit) {
      // Log the news object to debug
      console.log("News to edit (raw data from list):", newsToEdit);
      
      // Process the news data for consistency
      const processedNewsData = {
        id: newsToEdit.id,
        title: newsToEdit.title || '',
        content: newsToEdit.content || '',
        featuredImage: newsToEdit.featuredImage || newsToEdit.image || '',
        category: newsToEdit.category || '',
        state: newsToEdit.state || '',
        district: newsToEdit.district || '',
        contentType: newsToEdit.contentType || 'standard',
        status: newsToEdit.status || 'pending',
        youtubeUrl: newsToEdit.youtubeUrl || '',
        thumbnailUrl: newsToEdit.thumbnailUrl || ''
      };
      
      // Navigate to the edit screen with the news ID and pass the data in state
      navigate(`/editor/edit/${newsId}`, { state: { newsData: processedNewsData } });
    } else {
      setError('Could not find the news item to edit');
    }
  };

  // Function to fetch more details about a specific news item if needed
  const fetchNewsDetails = async (newsId) => {
    try {
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

      // Fetch the specific news item
      const response = await axios.get(`${baseURL}/api/news/${newsId}`, config);
      
      console.log('Detailed news response:', response.data);
      
      if (response.data && (response.data.featuredImage || response.data.image)) {
        // Update the selected news with the featured image
        setSelectedNews(prev => ({
          ...prev,
          featuredImage: response.data.featuredImage || response.data.image || prev.featuredImage
        }));
        
        console.log('Updated featuredImage from API:', response.data.featuredImage || response.data.image);
      }
    } catch (err) {
      console.error('Error fetching news details:', err);
    }
  };

  // Function to handle popup close
  const handleClosePopup = () => {
    setShowEditPopup(false);
    setSelectedNews(null);
    setIsVideoContent(false);
    setError(null); // Clear any existing errors
    setSuccessMessage(null); // Clear any success messages
  };

  // Function to handle save changes
  const handleSaveChanges = async (updatedData) => {
    try {
      setUpdateLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create a comprehensive payload with all necessary fields
      const payload = {
        id: selectedNews.id, // Preserve the ID
        title: updatedData.title || '',
        content: updatedData.content || '',
        featuredImage: updatedData.featuredImage !== 'null' && updatedData.featuredImage !== null ? updatedData.featuredImage : '',
        category: updatedData.category || '',
        state: updatedData.state || '',
        district: updatedData.district || '',
        contentType: updatedData.contentType || 'standard',
        status: updatedData.status || 'pending' // Preserve the status
      };
      
      // Add video specific fields if it's video content
      if (isVideoContent) {
        payload.youtubeUrl = updatedData.youtubeUrl || '';
        payload.thumbnailUrl = updatedData.thumbnailUrl || '';
        payload.contentType = 'video';
      }
      
      // Preserve any other fields that might be important
      if (updatedData.author) payload.author = updatedData.author;
      if (updatedData.authorId) payload.authorId = updatedData.authorId;
      if (updatedData.createdAt) payload.createdAt = updatedData.createdAt;
      
      console.log("Sending update payload to API:", payload);
      console.log(`PUT request URL: ${baseURL}/api/news/${selectedNews.id}`);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Make the PUT request to update the news item
      const response = await axios.put(
        `${baseURL}/api/news/${selectedNews.id}`, 
        payload, 
        config
      );
      
      console.log("Update response:", response.data);
      
      // Update the local state immediately with the updated news item
      if (response.data) {
        // Find and update the news item in the list
        setPendingNews(prevNews => 
          prevNews.map(news => 
            news.id === selectedNews.id ? 
              // If this is the updated news, replace it with the response data or merge with our updates
              (response.data.data || {...news, ...payload}) : 
              news
          )
        );
      }
      
      // Show success message
      setSuccessMessage('Post updated successfully');
      
      // Wait a moment before closing the popup and refreshing the list
      setTimeout(() => {
        handleClosePopup();
        fetchPendingNews(); // Refresh the list to show updated data
      }, 1500);
      
    } catch (err) {
      console.error('Error updating news:', err);
      setError(`Failed to update news: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Function to truncate text for display
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + '...' : textContent;
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pendingNews.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add the formatDate function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      {/* Add style tag for animations */}
      <style dangerouslySetInnerHTML={{ __html: spinAnimation }} />
      
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
          padding: '40px 16px',
          textAlign: 'center',
          color: '#6b7280',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(99, 102, 241, 0.3)',
            borderTopColor: '#6366f1',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }} />
          <div style={{fontSize: '16px', fontWeight: '500'}}>
            Loading pending news...
          </div>
          <div style={{fontSize: '14px', color: '#9ca3af', marginTop: '8px'}}>
            Fetching data from server...
          </div>
        </div>
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
            gridTemplateColumns: '1.5fr 1.5fr 1fr 0.8fr 0.8fr 0.5fr', 
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
              Action
            </div>
          </div>

          {currentItems.length === 0 ? (
            /* Empty State */
            <div style={{ 
              padding: '24px 16px',
              textAlign: 'center',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: 'white'
            }}>
              {error ? (
                <>
                  <div style={{fontSize: '20px', marginBottom: '10px', color: '#b91c1c'}}>Error Loading Posts</div>
                  <div>Please try refreshing the page or check your network connection.</div>
                  <button 
                    onClick={fetchPendingNews}
                    style={{
                      marginTop: '16px',
                      padding: '8px 16px',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Retry Now
                  </button>
                </>
              ) : (
                <>No posts available for approval.</>
              )}
            </div>
          ) : (
            /* News Items */
            currentItems.map((news, index) => (
              <div 
                key={news.id || index}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1.5fr 1.5fr 1fr 0.8fr 0.8fr 0.5fr', 
                  borderBottom: index < currentItems.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ 
                  padding: '16px', 
                  borderRight: '1px solid #e5e7eb',
                  color: '#1f2937'
                }}>
                  {news.title || 'No title'}
                </div>
                <div style={{ 
                  padding: '16px', 
                  borderRight: '1px solid #e5e7eb',
                  color: '#1f2937'
                }}>
                  {truncateText(news.content)}
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
                  {news.state || 'N/A'}
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
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => handleEdit(news.id)}
                    style={{
                      backgroundColor: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(news.id, 'approved')}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Approve"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(news.id, 'rejected')}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Reject"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && pendingNews.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <div>
            {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, pendingNews.length)} Items of {pendingNews.length} — 
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
            <button 
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: currentPage === 1 ? '#e5e7eb' : '#e5edff', 
                color: currentPage === 1 ? '#9ca3af' : '#4f46e5', 
                border: 'none', 
                borderRadius: '6px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              Previous
            </button>
            <button 
              onClick={() => paginate(currentPage < Math.ceil(pendingNews.length / itemsPerPage) ? currentPage + 1 : currentPage)}
              disabled={currentPage >= Math.ceil(pendingNews.length / itemsPerPage)}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: currentPage >= Math.ceil(pendingNews.length / itemsPerPage) ? '#e5e7eb' : '#e5edff', 
                color: currentPage >= Math.ceil(pendingNews.length / itemsPerPage) ? '#9ca3af' : '#4f46e5', 
                border: 'none', 
                borderRadius: '6px',
                cursor: currentPage >= Math.ceil(pendingNews.length / itemsPerPage) ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {showEditPopup && selectedNews && (
        // Log selectedNews when the popup renders
        (() => { 
          console.log("Rendering edit popup with selectedNews:", selectedNews);
          return (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '1200px',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h2 style={{ 
                      fontSize: '24px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 8px 0'
                    }}>
                      {isVideoContent ? 'Create a Video Post' : 'Create a Standard Post'}
                    </h2>
                    <p style={{
                      color: '#6B7280',
                      margin: 0
                    }}>
                      {isVideoContent 
                        ? 'Create and publish video content for the platform'
                        : 'Create and publish news content for the platform'
                      }
                    </p>
                  </div>
                  <button
                    onClick={handleClosePopup}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6B7280',
                      borderRadius: '50%',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '24px',
                  padding: '24px'
                }}>
                  {/* Error message inside popup */}
                  {error && (
                    <div style={{ 
                      gridColumn: '1 / -1',
                      backgroundColor: '#fee2e2', 
                      color: '#b91c1c',
                      padding: '12px', 
                      borderRadius: '4px',
                      marginBottom: '16px',
                      fontSize: '14px'
                    }}>
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                
                  <div>
                    {/* Main Content Section */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#111827',
                        marginBottom: '8px'
                      }}>
                        {isVideoContent ? 'Video Title' : 'Post Title/Headline'}
                      </label>
                      <input
                        type="text"
                        value={selectedNews.title || ''}
                        onChange={(e) => setSelectedNews({...selectedNews, title: e.target.value})}
                        placeholder="Write title here..."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '16px'
                        }}
                      />
                    </div>

                    {isVideoContent ? (
                      <>
                        <div style={{ marginBottom: '24px' }}>
                          <label style={{
                            display: 'block',
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#111827',
                            marginBottom: '8px'
                          }}>
                            Video URL (YouTube, Vimeo, etc.)
                          </label>
                          <input
                            type="url"
                            value={selectedNews.youtubeUrl || ''}
                            onChange={(e) => setSelectedNews({...selectedNews, youtubeUrl: e.target.value})}
                            placeholder="https://"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '16px'
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                          <label style={{
                            display: 'block',
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#111827',
                            marginBottom: '8px'
                          }}>
                            Video Thumbnail
                          </label>
                          <div style={{
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            padding: '8px'
                          }}>
                            <button style={{
                              padding: '6px 12px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #D1D5DB',
                              borderRadius: '4px',
                              fontSize: '14px',
                              color: '#374151'
                            }}>
                              Choose File
                            </button>
                            <span style={{ marginLeft: '12px', color: '#6B7280' }}>
                              {selectedNews.thumbnailUrl ? 'File selected' : 'no file selected'}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#111827',
                          marginBottom: '8px'
                        }}>
                          Featured Image
                        </label>
                        <div style={{
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          padding: '8px'
                        }}>
                          <button style={{
                            padding: '6px 12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #D1D5DB',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: '#374151'
                          }}>
                            Choose File
                          </button>
                          <span style={{ marginLeft: '12px', color: '#6B7280' }}>
                            {selectedNews.featuredImage && selectedNews.featuredImage !== 'null' && selectedNews.featuredImage !== null ? 
                              (typeof selectedNews.featuredImage === 'string' ? 
                                selectedNews.featuredImage.split('/').pop() : 'File selected') 
                              : 'no file selected'}
                          </span>
                          
                          {/* Image Preview */}
                          {(() => {
                            // Debug the featuredImage value
                            console.log("Featured image value:", selectedNews.featuredImage);
                            
                            // Directly handle the specific format mentioned by user
                            if (selectedNews.featuredImage && 
                               (selectedNews.featuredImage.includes('/uploads/images/featuredImage-') || 
                                selectedNews.featuredImage.includes('uploads/images/featuredImage-'))) {
                              
                              // This is the exact format the user mentioned
                              console.log("Found the expected image path format!");
                              
                              // Ensure path has leading slash
                              const imagePath = selectedNews.featuredImage.startsWith('/') ? 
                                selectedNews.featuredImage : 
                                `/${selectedNews.featuredImage}`;
                                
                              // Construct the full image URL
                              const imageUrl = `https://api.newztok.in${imagePath}`;
                              
                              console.log("Constructed image URL:", imageUrl);
                              
                              return (
                                <div style={{ marginTop: '10px' }}>
                                  <div style={{ fontSize: '13px', marginBottom: '8px', color: '#10b981', fontWeight: '500' }}>
                                    ✓ Image path matches expected format
                                  </div>
                                  <img 
                                    src={imageUrl}
                                    alt="Featured" 
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '200px', 
                                      borderRadius: '4px',
                                      border: '2px solid #e5e7eb',
                                      padding: '2px'
                                    }} 
                                    onError={(e) => {
                                      console.error("Image failed to load:", imageUrl);
                                      e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                                      e.target.style.opacity = "0.5";
                                    }}
                                  />
                                </div>
                              );
                            }
                            
                            // Check if we need to manually set the path for known format
                            if (!selectedNews.featuredImage && selectedNews.id) {
                              // This is a fallback in case the featuredImage wasn't provided but we know the format
                              console.log("Attempting fallback image path construction");
                            }
                            
                            // Define a function to prepare image URLs with different variations
                            const prepareImageUrls = (imagePath) => {
                              if (!imagePath) return [];
                              
                              // Check if the path matches the expected format for uploads
                              const isUploadPath = /^\/uploads\/images\/featuredImage-\d+-\d+\.\w+$/.test(imagePath) ||
                                                   /^uploads\/images\/featuredImage-\d+-\d+\.\w+$/.test(imagePath);
                              
                              console.log("Is upload path format:", isUploadPath);
                              
                              return [
                                // Standard variations that should cover most cases
                                imagePath.startsWith('http') ? imagePath : null,
                                imagePath.startsWith('/') ? `https://api.newztok.in${imagePath}` : null,
                                !imagePath.startsWith('/') ? `https://api.newztok.in/${imagePath}` : null,
                                
                                // Specific variations for the uploads path format
                                isUploadPath && imagePath.startsWith('/') ? `https://api.newztok.in${imagePath}` : null,
                                isUploadPath && !imagePath.startsWith('/') ? `https://api.newztok.in/${imagePath}` : null,
                                isUploadPath && imagePath.startsWith('/uploads') ? `https://api.newztok.in${imagePath}` : null,
                                isUploadPath && imagePath.startsWith('uploads') ? `https://api.newztok.in/${imagePath}` : null,
                                
                                // Try with direct server path
                                isUploadPath ? `https://api.newztok.in/uploads/images/${imagePath.split('/').pop()}` : null,
                              ].filter(Boolean);
                            };
                            
                            if (selectedNews.featuredImage) {
                              // Get all possible URLs to try
                              const possibleSrcs = prepareImageUrls(selectedNews.featuredImage);
                              console.log("Trying image URLs:", possibleSrcs);
                              
                              return (
                                <div style={{ marginTop: '10px' }}>
                                  <img 
                                    src={possibleSrcs[0]} // Use the first possible URL
                                    alt="Featured" 
                                    style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' }} 
                                    onError={(e) => {
                                      console.error("Primary image URL failed to load:", possibleSrcs[0]);
                                      
                                      // Try alternate URLs if available
                                      const currentIndex = possibleSrcs.indexOf(e.target.src);
                                      if (currentIndex < possibleSrcs.length - 1) {
                                        console.log(`Trying alternate URL ${currentIndex + 1}:`, possibleSrcs[currentIndex + 1]);
                                        e.target.src = possibleSrcs[currentIndex + 1];
                                      } else {
                                        // If all URLs fail, show placeholder
                                        e.target.src = "https://via.placeholder.com/150x100?text=Image+Not+Found";
                                        e.target.style.opacity = "0.5";
                                      }
                                    }}
                                  />
                                </div>
                              );
                            } else if (selectedNews.id) {
                              // If no featuredImage but we have an ID, show a message encouraging refresh
                              return (
                                <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px', color: '#4f46e5' }}>
                                  <div>Featured image info not available. Path format should be:</div>
                                  <code style={{ display: 'block', marginTop: '4px', backgroundColor: '#e5e7eb', padding: '4px', borderRadius: '2px', fontSize: '12px' }}>
                                    /uploads/images/featuredImage-{'{timestamp}'}-{'{id}'}.jpg
                                  </code>
                                  <button 
                                    onClick={() => fetchNewsDetails(selectedNews.id)}
                                    style={{
                                      marginTop: '8px',
                                      padding: '4px 8px',
                                      backgroundColor: '#4f46e5',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Refresh Image Data
                                  </button>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#111827',
                        marginBottom: '8px'
                      }}>
                        {isVideoContent ? 'Video Description' : 'Content'}
                      </label>
                      <Editor
                        value={selectedNews.content || ''}
                        init={{
                          height: 500,
                          menubar: true,
                          apiKey: 'omxjaluaxpgfpa6xkfadimoprrirfmhozsrtpb3o1uimu4c5',
                          branding: false,
                          promotion: false,
                          readonly: false,
                          plugins: [
                            // Core editing features
                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                            // Premium features
                            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                          ],
                          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                          tinycomments_mode: 'embedded',
                          tinycomments_author: 'Editor',
                          mergetags_list: [
                            { value: 'First.Name', title: 'First Name' },
                            { value: 'Email', title: 'Email' },
                          ],
                          ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                        }}
                        onInit={(evt, editor) => {
                          console.log('Editor initialized successfully');
                        }}
                        onEditorChange={(content) => setSelectedNews({...selectedNews, content})}
                        onError={(err) => {
                          console.error('TinyMCE Editor Error:', err);
                          setError('Editor failed to initialize properly. Please contact support.');
                        }}
                      />
                    </div>
                  </div>

                  {/* Organize Section */}
                  <div>
                    <div style={{
                      backgroundColor: '#F9FAFB',
                      padding: '24px',
                      borderRadius: '8px'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#111827',
                        marginTop: 0,
                        marginBottom: '16px'
                      }}>
                        Organize
                      </h3>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#111827',
                          marginBottom: '8px'
                        }}>
                          CATEGORY
                        </label>
                        <select
                          value={selectedNews.category || ''}
                          onChange={(e) => setSelectedNews({...selectedNews, category: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            backgroundColor: '#FFFFFF'
                          }}
                        >
                          <option value="">---------</option>
                          <option value="trending">ट्रेंडिंग | Trending</option>
                          <option value="national">राष्ट्रीय | National</option>
                          <option value="international">अंतरराष्ट्रीय | International</option>
                          <option value="sports">खेल | Sports</option>
                          <option value="entertainment">मनोरंजन | Entertainment</option>
                          <option value="politics">Politics</option>
                          <option value="technology">Technology</option>
                          <option value="business">Business</option>
                          <option value="health">Health</option>
                          <option value="education">Education</option>
                          <option value="world">World</option>
                          <option value="lifestyle">Lifestyle</option>
                        </select>
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#111827',
                          marginBottom: '8px'
                        }}>
                          STATE
                        </label>
                        <select
                          value={selectedNews.state || ''}
                          onChange={(e) => setSelectedNews({...selectedNews, state: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            backgroundColor: '#FFFFFF'
                          }}
                        >
                          <option value="">---------</option>
                          <option value="bihar">बिहार | Bihar</option>
                          <option value="jharkhand">झारखंड | Jharkhand</option>
                          <option value="up">उत्तर प्रदेश | Uttar Pradesh</option>
                        </select>
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#111827',
                          marginBottom: '8px'
                        }}>
                          DISTRICT
                        </label>
                        <select
                          value={selectedNews.district || ''}
                          onChange={(e) => setSelectedNews({...selectedNews, district: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            backgroundColor: '#FFFFFF'
                          }}
                          disabled={!selectedNews.state}
                        >
                          <option value="">---------</option>
                          {selectedNews.state === 'bihar' && (
                            <>
                              <option value="patna">पटना | Patna</option>
                              <option value="gaya">गया | Gaya</option>
                              <option value="munger">मुंगेर | Munger</option>
                              <option value="bhagalpur">भागलपुर | Bhagalpur</option>
                              <option value="purnia">पूर्णिया | Purnia</option>
                              <option value="darbhanga">दरभंगा | Darbhanga</option>
                              <option value="muzaffarpur">मुजफ्फरपुर | Muzaffarpur</option>
                              <option value="saharsa">सहरसा | Saharsa</option>
                              <option value="sitamarhi">सीतामढ़ी | Sitamarhi</option>
                              <option value="vaishali">वैशाली | Vaishali</option>
                              <option value="siwan">सिवान | Siwan</option>
                              <option value="saran">सारण | Saran</option>
                              <option value="gopalganj">गोपालगंज | Gopalganj</option>
                              <option value="begusarai">बेगूसराय | Begusarai</option>
                              <option value="samastipur">समस्तीपुर | Samastipur</option>
                              <option value="madhubani">मधुबनी | Madhubani</option>
                              <option value="supaul">सुपौल | Supaul</option>
                              <option value="araria">अररिया | Araria</option>
                              <option value="kishanganj">किशनगंज | Kishanganj</option>
                              <option value="katihar">कटिहार | Katihar</option>
                              <option value="east-champaran">पूर्वी चंपारण | East Champaran</option>
                              <option value="west-champaran">पश्चिमी चंपारण | West Champaran</option>
                              <option value="sheohar">शिवहर | Sheohar</option>
                              <option value="madhepura">मधेपुरा | Madhepura</option>
                            </>
                          )}
                          {selectedNews.state === 'jharkhand' && (
                            <>
                              <option value="ranchi">रांची | Ranchi</option>
                              <option value="jamshedpur">जमशेदपुर | Jamshedpur</option>
                              <option value="dhanbad">धनबाद | Dhanbad</option>
                              <option value="bokaro">बोकारो | Bokaro</option>
                              <option value="deoghar">देवघर | Deoghar</option>
                              <option value="hazaribagh">हजारीबाग | Hazaribagh</option>
                              <option value="giridih">गिरिडीह | Giridih</option>
                              <option value="koderma">कोडरमा | Koderma</option>
                              <option value="chatra">चतरा | Chatra</option>
                              <option value="gumla">गुमला | Gumla</option>
                              <option value="latehar">लातेहार | Latehar</option>
                              <option value="lohardaga">लोहरदगा | Lohardaga</option>
                              <option value="pakur">पाकुड़ | Pakur</option>
                              <option value="palamu">पलामू | Palamu</option>
                              <option value="ramgarh">रामगढ़ | Ramgarh</option>
                              <option value="sahibganj">साहिबगंज | Sahibganj</option>
                              <option value="simdega">सिमडेगा | Simdega</option>
                              <option value="singhbhum">सिंहभूम | Singhbhum</option>
                              <option value="seraikela-kharsawan">सरायकेला खरसावां | Seraikela Kharsawan</option>
                              <option value="east-singhbhum">पूर्वी सिंहभूम | East Singhbhum</option>
                              <option value="west-singhbhum">पश्चिमी सिंहभूम | West Singhbhum</option>
                            </>
                          )}
                          {selectedNews.state === 'up' && (
                            <>
                              <option value="lucknow">लखनऊ | Lucknow</option>
                              <option value="kanpur">कानपुर | Kanpur</option>
                              <option value="agra">आगरा | Agra</option>
                              <option value="varanasi">वाराणसी | Varanasi</option>
                              <option value="prayagraj">प्रयागराज | Prayagraj</option>
                              <option value="meerut">मेरठ | Meerut</option>
                              <option value="noida">नोएडा | Noida</option>
                              <option value="ghaziabad">गाजियाबाद | Ghaziabad</option>
                              <option value="bareilly">बरेली | Bareilly</option>
                              <option value="aligarh">अलीगढ़ | Aligarh</option>
                              <option value="moradabad">मुरादाबाद | Moradabad</option>
                              <option value="saharanpur">सहारनपुर | Saharanpur</option>
                              <option value="gorakhpur">गोरखपुर | Gorakhpur</option>
                              <option value="faizabad">फैजाबाद | Faizabad</option>
                              <option value="jaunpur">जौनपुर | Jaunpur</option>
                              <option value="mathura">मथुरा | Mathura</option>
                              <option value="ballia">बलिया | Ballia</option>
                              <option value="rae-bareli">रायबरेली | Rae Bareli</option>
                              <option value="sultanpur">सुल्तानपुर | Sultanpur</option>
                              <option value="fatehpur">फतेहपुर | Fatehpur</option>
                              <option value="pratapgarh">प्रतापगढ़ | Pratapgarh</option>
                              <option value="kaushambi">कौशाम्बी | Kaushambi</option>
                              <option value="jhansi">झांसी | Jhansi</option>
                              <option value="lalitpur">ललितपुर | Lalitpur</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{
                  borderTop: '1px solid #E5E7EB',
                  padding: '16px 24px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}>
                  {successMessage && (
                    <div style={{
                      backgroundColor: '#d1fae5',
                      color: '#047857',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      marginRight: 'auto',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ marginRight: '6px' }}>✓</span> {successMessage}
                    </div>
                  )}
                  <button
                    onClick={handleClosePopup}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#1F2937',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Discard
                  </button>
                  <button
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#FFFFFF',
                      color: '#4F46E5',
                      border: '1px solid #4F46E5',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleSaveChanges(selectedNews)}
                    disabled={updateLoading}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4F46E5',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: updateLoading ? 'not-allowed' : 'pointer',
                      opacity: updateLoading ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {updateLoading ? (
                      <>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Updating...
                      </>
                    ) : (
                      isVideoContent ? 'Publish Video' : 'Publish Post'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
};

export default PendingApprovals; 