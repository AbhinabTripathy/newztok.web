import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import EditorHeader from './EditorHeader';
import EditorFooter from './EditorFooter';
import EditorSidebar from './EditorSidebar';
import './editor.css';

// API base URL configuration
const API_BASE_URL = 'http://13.234.42.114:3333';

// Define the state and district data structure
const locationData = {
    jharkhand: [
        { hindi: "रांची", english: "Ranchi", value: "ranchi" },
        { hindi: "जमशेदपुर", english: "Jamshedpur", value: "jamshedpur" },
        { hindi: "धनबाद", english: "Dhanbad", value: "dhanbad" },
        { hindi: "बोकारो", english: "Bokaro", value: "bokaro" },
        { hindi: "देवघर", english: "Deoghar", value: "deoghar" },
        { hindi: "हजारीबाग", english: "Hazaribagh", value: "hazaribagh" },
        { hindi: "गिरिडीह", english: "Giridih", value: "giridih" },
        { hindi: "कोडरमा", english: "Koderma", value: "koderma" },
        { hindi: "चतरा", english: "Chatra", value: "chatra" },
        { hindi: "गुमला", english: "Gumla", value: "gumla" },
        { hindi: "लातेहार", english: "Latehar", value: "latehar" },
        { hindi: "लोहरदगा", english: "Lohardaga", value: "lohardaga" },
        { hindi: "पाकुड़", english: "Pakur", value: "pakur" },
        { hindi: "पलामू", english: "Palamu", value: "palamu" },
        { hindi: "रामगढ़", english: "Ramgarh", value: "ramgarh" },
        { hindi: "साहिबगंज", english: "Sahibganj", value: "sahibganj" },
        { hindi: "सिमडेगा", english: "Simdega", value: "simdega" },
        { hindi: "सिंहभूम", english: "Singhbhum", value: "singhbhum" },
        { hindi: "सरायकेला खरसावां", english: "Seraikela Kharsawan", value: "seraikela-kharsawan" },
        { hindi: "पूर्वी सिंहभूम", english: "East Singhbhum", value: "east-singhbhum" },
        { hindi: "पश्चिमी सिंहभूम", english: "West Singhbhum", value: "west-singhbhum" }
    ],
    bihar: [
        { hindi: "पटना", english: "Patna", value: "patna" },
        { hindi: "गया", english: "Gaya", value: "gaya" },
        { hindi: "मुंगेर", english: "Munger", value: "munger" },
        { hindi: "भागलपुर", english: "Bhagalpur", value: "bhagalpur" },
        { hindi: "पूर्णिया", english: "Purnia", value: "purnia" },
        { hindi: "दरभंगा", english: "Darbhanga", value: "darbhanga" },
        { hindi: "मुजफ्फरपुर", english: "Muzaffarpur", value: "muzaffarpur" },
        { hindi: "सहरसा", english: "Saharsa", value: "saharsa" },
        { hindi: "सीतामढ़ी", english: "Sitamarhi", value: "sitamarhi" },
        { hindi: "वैशाली", english: "Vaishali", value: "vaishali" },
        { hindi: "सिवान", english: "Siwan", value: "siwan" },
        { hindi: "सारण", english: "Saran", value: "saran" },
        { hindi: "गोपालगंज", english: "Gopalganj", value: "gopalganj" },
        { hindi: "बेगूसराय", english: "Begusarai", value: "begusarai" },
        { hindi: "समस्तीपुर", english: "Samastipur", value: "samastipur" },
        { hindi: "मधुबनी", english: "Madhubani", value: "madhubani" },
        { hindi: "सुपौल", english: "Supaul", value: "supaul" },
        { hindi: "अररिया", english: "Araria", value: "araria" },
        { hindi: "किशनगंज", english: "Kishanganj", value: "kishanganj" },
        { hindi: "कटिहार", english: "Katihar", value: "katihar" },
        { hindi: "पूर्वी चंपारण", english: "East Champaran", value: "east-champaran" },
        { hindi: "पश्चिमी चंपारण", english: "West Champaran", value: "west-champaran" },
        { hindi: "शिवहर", english: "Sheohar", value: "sheohar" },
        { hindi: "मधेपुरा", english: "Madhepura", value: "madhepura" }
    ],
    "up": [
        { hindi: "लखनऊ", english: "Lucknow", value: "lucknow" },
        { hindi: "कानपुर", english: "Kanpur", value: "kanpur" },
        { hindi: "आगरा", english: "Agra", value: "agra" },
        { hindi: "वाराणसी", english: "Varanasi", value: "varanasi" },
        { hindi: "प्रयागराज", english: "Prayagraj", value: "prayagraj" },
        { hindi: "मेरठ", english: "Meerut", value: "meerut" },
        { hindi: "नोएडा", english: "Noida", value: "noida" },
        { hindi: "गाजियाबाद", english: "Ghaziabad", value: "ghaziabad" },
        { hindi: "बरेली", english: "Bareilly", value: "bareilly" },
        { hindi: "अलीगढ़", english: "Aligarh", value: "aligarh" },
        { hindi: "मुरादाबाद", english: "Moradabad", value: "moradabad" },
        { hindi: "सहारनपुर", english: "Saharanpur", value: "saharanpur" },
        { hindi: "गोरखपुर", english: "Gorakhpur", value: "gorakhpur" },
        { hindi: "फैजाबाद", english: "Faizabad", value: "faizabad" },
        { hindi: "जौनपुर", english: "Jaunpur", value: "jaunpur" },
        { hindi: "मथुरा", english: "Mathura", value: "mathura" },
        { hindi: "बलिया", english: "Ballia", value: "ballia" },
        { hindi: "रायबरेली", english: "Rae Bareli", value: "rae-bareli" },
        { hindi: "सुल्तानपुर", english: "Sultanpur", value: "sultanpur" },
        { hindi: "फतेहपुर", english: "Fatehpur", value: "fatehpur" },
        { hindi: "प्रतापगढ़", english: "Pratapgarh", value: "pratapgarh" },
        { hindi: "कौशाम्बी", english: "Kaushambi", value: "kaushambi" },
        { hindi: "झांसी", english: "Jhansi", value: "jhansi" },
        { hindi: "ललितपुर", english: "Lalitpur", value: "lalitpur" }
    ]
};

const EditorEditScreen = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isVideoContent, setIsVideoContent] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('pendingApprovals');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch news data on component mount
  useEffect(() => {
    fetchNewsData();
  }, [newsId]);

  const getAuthToken = () => {
    // Check all possible storage locations for the token
    const storageLocations = [localStorage, sessionStorage];
    // Use the same key order as in PendingApprovals to ensure consistency
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
    
    return null;
  };

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check for navigation state first
      const locationState = location.state;
      if (locationState && locationState.newsData) {
        console.log('Using news data from navigation state:', locationState.newsData);
        // Ensure state and district are included and have fallbacks
        const navData = {
          ...locationState.newsData,
          state: locationState.newsData.state || '',
          district: locationState.newsData.district || '',
          category: locationState.newsData.category || '',
          featuredImage: locationState.newsData.featuredImage || ''
        };
        setNewsData(navData);
        setIsVideoContent(navData.contentType === 'video' || !!navData.youtubeUrl);
        setLoading(false);
        return;
      }
      
      // Fetch from API if no navigation state
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      // Fetch data using the direct ID endpoint
      let response;
      try {
        console.log(`Attempting to fetch news with ID ${newsId} via direct endpoint /api/news/${newsId}`);
        response = await axios.get(`${API_BASE_URL}/api/news/${newsId}`, config);
      } catch (err) {
        console.log(`Direct endpoint failed, trying pending list...`);
        // Try other endpoints if the direct one fails (as was previously implemented)
        try {
          const pendingResponse = await axios.get(`${API_BASE_URL}/api/news/pending`, config);
          if (pendingResponse.data) {
            const newsItems = Array.isArray(pendingResponse.data) ? pendingResponse.data : (pendingResponse.data.data || []);
            const foundItem = newsItems.find(item => item.id == newsId);
            if (foundItem) response = { data: foundItem };
          }
        } catch (pendingErr) {
          console.log(`Pending list failed, trying rejected list...`);
          try {
            const rejectedResponse = await axios.get(`${API_BASE_URL}/api/news/rejected`, config);
            if (rejectedResponse.data) {
              const newsItems = Array.isArray(rejectedResponse.data) ? rejectedResponse.data : (rejectedResponse.data.data || []);
              const foundItem = newsItems.find(item => item.id == newsId);
              if (foundItem) response = { data: foundItem };
            }
          } catch (rejectedErr) {
            throw new Error(`News item ${newsId} not found in any list.`);
          }
        }
        if (!response) throw new Error(`News item ${newsId} not found.`);
      }
      
      console.log('Successfully retrieved news data:', response.data);
      
      if (response.data) {
        const newsItem = response.data.data || response.data;
        
        // Process fetched data with fallbacks
        const processedNewsData = {
          id: newsItem.id,
          title: newsItem.title || '',
          content: newsItem.content || '',
          featuredImage: newsItem.featuredImage || newsItem.image || '',
          category: newsItem.category || '',
          state: newsItem.state || '',
          district: newsItem.district || '',
          contentType: newsItem.contentType || 'standard',
          status: newsItem.status || 'pending',
          youtubeUrl: newsItem.youtubeUrl || '',
          thumbnailUrl: newsItem.thumbnailUrl || ''
        };
        
        console.log('Processed News Data:', processedNewsData); // Log processed data
        setNewsData(processedNewsData);
        setIsVideoContent(processedNewsData.contentType === 'video' || !!processedNewsData.youtubeUrl);
      } else {
        throw new Error('News item data is empty');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(`Failed to load news data: ${err.message}`);
      // Set empty news data to avoid errors during rendering
      setNewsData({ id: newsId, title: '', content: '', featuredImage: '', category: '', state: '', district: '' });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form changes
  const handleInputChange = (field, value) => {
    setNewsData({
      ...newsData,
      [field]: value
    });
  };

  // Function to handle save changes
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Get auth token
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Configure headers with token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Prepare the update data
      const updateData = {
        title: newsData.title,
        content: newsData.content,
        category: newsData.category || '',
        state: newsData.state || '',
        district: newsData.district || '',
        featuredImage: newsData.featuredImage || ''
      };

      // If it's video content, include video-specific fields
      if (isVideoContent) {
        updateData.youtubeUrl = newsData.youtubeUrl || '';
        updateData.contentType = 'video';
      }

      console.log('Sending update request with data:', updateData);

      // Send PUT request to update the news
      const response = await axios.put(
        `${API_BASE_URL}/api/news/${newsId}`, 
        updateData,
        config
      );

      console.log('News updated successfully:', response.data);
      
      // Save to localStorage to preserve user's work regardless of API success
      const updatedData = {
        id: newsId,
        title: newsData.title,
        content: newsData.content,
        category: newsData.category || '',
        state: newsData.state || '',
        district: newsData.district || '',
        featuredImage: newsData.featuredImage || '',
        updatedAt: new Date().toISOString()
      };
      
      // IMPORTANT: Use the same key pattern as EditPost.jsx for consistency
      localStorage.setItem(`updatedNewsItem_${newsId}`, JSON.stringify(updatedData));
      console.log('Saved editor updates to localStorage:', updatedData);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.style.backgroundColor = '#ECFDF5';
      successMessage.style.color = '#065F46';
      successMessage.style.padding = '12px 16px';
      successMessage.style.borderRadius = '6px';
      successMessage.style.marginBottom = '16px';
      successMessage.style.fontSize = '14px';
      successMessage.style.position = 'fixed';
      successMessage.style.top = '20px';
      successMessage.style.right = '20px';
      successMessage.style.zIndex = '1000';
      successMessage.innerText = 'Post updated successfully! Redirecting...';
      document.body.appendChild(successMessage);
      
      // Redirect after short delay - always allow user to continue regardless of API success
      setTimeout(() => {
        document.body.removeChild(successMessage);
        
        // Navigate back to pending approvals page
        navigate('/editor/pending-approvals', { replace: true });
      }, 1500);
      
    } catch (error) {
      console.error('Error updating news:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update news');
      
      // Display error message
      const errorMessage = document.createElement('div');
      errorMessage.style.backgroundColor = '#FEF2F2';
      errorMessage.style.color = '#B91C1C';
      errorMessage.style.padding = '12px 16px';
      errorMessage.style.borderRadius = '6px';
      errorMessage.style.marginBottom = '16px';
      errorMessage.style.fontSize = '14px';
      errorMessage.style.position = 'fixed';
      errorMessage.style.top = '20px';
      errorMessage.style.right = '20px';
      errorMessage.style.zIndex = '1000';
      errorMessage.innerText = `Error: ${error.response?.data?.message || error.message || 'Failed to update news'}`;
      document.body.appendChild(errorMessage);
      
      // Even on error, store data locally
      try {
        const emergencyBackup = { 
          id: newsId, 
          title: newsData.title, 
          content: newsData.content, 
          lastSaved: new Date().toISOString() 
        };
        localStorage.setItem('emergency_backup_' + newsId, JSON.stringify(emergencyBackup));
        
        // Remove error message after 3 seconds but don't redirect automatically
        setTimeout(() => {
          document.body.removeChild(errorMessage);
        }, 3000);
      } catch (storageErr) {
        console.error('Failed to save emergency backup:', storageErr);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle cancel
  const handleCancel = () => {
    navigate('/editor/pendingApprovals');
  };

  // Function to handle approve action
  const handleApprove = async () => {
    try {
      setUpdateLoading(true);
      setError(null);
      
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Send PUT request to update status
      await axios.put(`${API_BASE_URL}/api/news/${newsData.id}/status`, { 
        status: 'approved' 
      }, config);

      setSuccessMessage('Post approved successfully');
      
      // After a short delay, navigate back to the pending approvals page
      setTimeout(() => {
        navigate('/editor/pendingApprovals');
      }, 1500);
      
    } catch (err) {
      console.error('Error approving news:', err);
      setError(`Failed to approve news: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Function to handle reject action
  const handleReject = async () => {
    try {
      setUpdateLoading(true);
      setError(null);
      
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Send PUT request to update status
      await axios.put(`${API_BASE_URL}/api/news/${newsData.id}/status`, { 
        status: 'rejected' 
      }, config);

      setSuccessMessage('Post rejected successfully');
      
      // After a short delay, navigate back to the pending approvals page
      setTimeout(() => {
        navigate('/editor/pendingApprovals');
      }, 1500);
      
    } catch (err) {
      console.error('Error rejecting news:', err);
      setError(`Failed to reject news: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Function to handle route change from sidebar
  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/editor/${section}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <EditorHeader />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '250px', backgroundColor: '#1e2029' }}>
          <EditorSidebar onSectionChange={handleSectionChange} activeSection={activeSection} />
        </div>
        
        <main style={{ flex: 1, overflow: 'auto', backgroundColor: '#f8fafc', padding: '30px' }}>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '300px',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '3px solid #e5e7eb',
                borderTopColor: '#4f46e5',
                animation: 'spin 1s linear infinite'
              }}></div>
              <div style={{ color: '#6b7280' }}>Loading post data...</div>
            </div>
          ) : error ? (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              color: '#b91c1c', 
              padding: '24px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h2 style={{ 
                fontSize: '20px',
                marginTop: 0,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Error Loading News Item
              </h2>
              
              <p style={{ marginBottom: '16px' }}>
                {error}
              </p>
              
              <p style={{ marginBottom: '16px', color: '#9b1c1c' }}>
                This may be happening because:
              </p>
              
              <ul style={{ 
                marginBottom: '24px', 
                paddingLeft: '20px',
                color: '#9b1c1c',
                lineHeight: '1.5'
              }}>
                <li>The news item might have been deleted</li>
                <li>Your authentication token may have expired</li>
                <li>There could be a network connectivity issue</li>
                <li>The server might be temporarily unavailable</li>
              </ul>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => navigate('/editor/pendingApprovals')}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#1f2937',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Return to Pending Approvals
                </button>
                
                <button
                  onClick={() => fetchNewsData()}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <polyline points="23 20 23 14 17 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          ) : newsData ? (
            <div>
              {/* Page Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '24px',
                alignItems: 'center'
              }}>
                <div>
                  <h1 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    margin: '0 0 4px 0', 
                    color: '#111827' 
                  }}>
                    {isVideoContent ? 'Edit Video Post' : 'Edit Standard Post'}
                  </h1>
                  <p style={{ margin: 0, color: '#6b7280' }}>
                    Make changes to the {isVideoContent ? 'video' : 'news'} content 
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#1f2937',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {isSaving ? (
                      <>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>

              {/* Success message */}
              {successMessage && (
                <div style={{ 
                  backgroundColor: '#d1fae5', 
                  color: '#047857', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontWeight: 'bold' }}>✓</span> {successMessage}
                </div>
              )}

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr', 
                gap: '24px',
                marginBottom: '120px' // Extra space for footer
              }}>
                {/* Main Content Section */}
                <div>
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
                      value={newsData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Write title here..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  {isVideoContent && (
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
                        value={newsData.youtubeUrl || ''}
                        onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                        placeholder="https://"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '16px'
                        }}
                      />
                      
                      {/* YouTube preview if URL is provided */}
                      {newsData.youtubeUrl && (
                        <div style={{ marginTop: '12px' }}>
                          <div style={{ 
                            position: 'relative', 
                            paddingBottom: '56.25%', /* 16:9 aspect ratio */
                            height: 0,
                            overflow: 'hidden',
                            borderRadius: '8px'
                          }}>
                            <iframe
                              src={`https://www.youtube.com/embed/${newsData.youtubeUrl.split('v=')[1] || newsData.youtubeUrl.split('/').pop()}`}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: '1px solid #e5e7eb'
                              }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="YouTube Video"
                            ></iframe>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!isVideoContent && (
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
                        padding: '10px',
                        backgroundColor: '#f9fafb'
                      }}>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#4B5563' }}>Current Image Path:</span>
                          </div>
                          <input
                            type="text"
                            value={newsData.featuredImage || ''}
                            onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                            placeholder="Image path or URL"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                        
                        <div style={{
                          borderTop: '1px solid #E5E7EB',
                          paddingTop: '12px',
                          marginTop: '12px'
                        }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#4B5563' }}>Upload New Image:</span>
                          </div>
                          
                          <input
                            type="file"
                            id="featured-image-upload"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const newFile = e.target.files[0];
                                setNewsData({
                                  ...newsData,
                                  newFeaturedImage: newFile,
                                  newFeaturedImagePreview: URL.createObjectURL(newFile)
                                });
                              }
                            }}
                            style={{ display: 'none' }}
                          />
                          <label 
                            htmlFor="featured-image-upload"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              color: '#374151',
                              cursor: 'pointer'
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="17 8 12 3 7 8"></polyline>
                              <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Choose File
                          </label>
                          <span style={{ marginLeft: '12px', color: '#6B7280', fontSize: '14px' }}>
                            {newsData.newFeaturedImage ? newsData.newFeaturedImage.name : 'No file selected'}
                          </span>
                        </div>
                        
                        {/* Image Preview */}
                        {newsData.newFeaturedImagePreview ? (
                          <div style={{ marginTop: '12px' }}>
                            <p style={{ fontSize: '14px', color: '#10B981', marginBottom: '8px', fontWeight: '500' }}>
                              ✓ New image selected (will be uploaded when you save)
                            </p>
                            <img 
                              src={newsData.newFeaturedImagePreview}
                              alt="New Featured" 
                              style={{ 
                                maxWidth: '100%', 
                                maxHeight: '200px', 
                                borderRadius: '4px',
                                border: '2px solid #10B981',
                                padding: '2px'
                              }}
                            />
                          </div>
                        ) : newsData.featuredImage && (
                          <div style={{ marginTop: '10px' }}>
                            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Current image:</p>
                            <img 
                              src={newsData.featuredImage.startsWith('http') 
                                ? newsData.featuredImage 
                                : newsData.featuredImage.startsWith('/') 
                                  ? `${API_BASE_URL}${newsData.featuredImage}`
                                  : `${API_BASE_URL}/${newsData.featuredImage}`
                              }
                              alt="Featured" 
                              style={{ 
                                maxWidth: '100%', 
                                maxHeight: '200px', 
                                borderRadius: '4px',
                                border: '2px solid #e5e7eb',
                                padding: '2px'
                              }} 
                              onError={(e) => {
                                console.error("Image failed to load");
                                e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                                e.target.style.opacity = "0.5";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '24px' }}>
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
                      apiKey='12neoy88j35f94s7imoobuh1rtvbe8hczpl1rm50ssu2a5m5'
                      value={newsData.content || ''}
                      init={{
                        height: 500,
                        menubar: true,
                        branding: false,
                        promotion: false,
                        plugins: [
                          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                          'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
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
                      onEditorChange={(content) => handleInputChange('content', content)}
                    />
                  </div>
                </div>

                {/* Organization Section */}
                <div>
                  <div style={{
                    backgroundColor: '#F9FAFB',
                    padding: '24px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
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
                    
                    {/* Category Dropdown - Limited options */}
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
                        value={newsData.category || ''} // Ensure binding
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <option value="">---------</option> {/* Placeholder like EditPost */}
                        <option value="trending">ट्रेंडिंग | Trending</option>
                        <option value="national">राष्ट्रीय | National</option>
                        <option value="international">अंतरराष्ट्रीय | International</option>
                        <option value="sports">खेल | Sports</option>
                        <option value="entertainment">मनोरंजन | Entertainment</option>
                        {/* Removed other categories */}
                      </select>
                    </div>
                    
                    {/* State Dropdown - Limited options */}
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
                        value={newsData.state || ''} // Ensure binding
                        onChange={(e) => {
                          handleInputChange('state', e.target.value);
                          handleInputChange('district', ''); // Reset district when state changes
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <option value="">---------</option> {/* Placeholder like EditPost */}
                        <option value="bihar">बिहार | Bihar</option>
                        <option value="jharkhand">झारखंड | Jharkhand</option>
                        <option value="up">उत्तर प्रदेश | Uttar Pradesh</option>
                        {/* Removed other states */}
                      </select>
                    </div>
                    
                    {/* District Dropdown - Updated values */}
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
                        value={newsData.district || ''} // Ensure binding
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          backgroundColor: newsData.state ? '#FFFFFF' : '#f3f4f6' // Style when disabled
                        }}
                        disabled={!newsData.state} // Disable if no state is selected
                      >
                        <option value="">---------</option> {/* Placeholder like EditPost */}
                        {newsData.state && locationData[newsData.state] && locationData[newsData.state].map(district => (
                          // Use the specific 'value' from the updated locationData
                          <option key={district.value} value={district.value}>
                            {district.hindi} | {district.english}
                          </option>
                        ))}
                        {newsData.state && !locationData[newsData.state] && (
                           <option value="" disabled>No districts found for this state</option>
                        )}
                      </select>
                    </div>
                    
                    {/* Status section showing current status */}
                    <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                      <div style={{ fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                        CURRENT STATUS
                      </div>
                      <div style={{ 
                        display: 'inline-block', 
                        padding: '4px 12px', 
                        borderRadius: '16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        backgroundColor: newsData.status === 'pending' ? '#fef3c7' : 
                                         newsData.status === 'approved' ? '#d1fae5' : 
                                         newsData.status === 'rejected' ? '#fee2e2' : '#e5e7eb',
                        color: newsData.status === 'pending' ? '#92400e' : 
                               newsData.status === 'approved' ? '#065f46' : 
                               newsData.status === 'rejected' ? '#b91c1c' : '#374151'
                      }}>
                        {newsData.status === 'pending' ? 'Pending Approval' : 
                         newsData.status === 'approved' ? 'Approved' : 
                         newsData.status === 'rejected' ? 'Rejected' : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
      
      <EditorFooter />
    </div>
  );
};

export default EditorEditScreen; 