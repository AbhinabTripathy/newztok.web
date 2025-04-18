import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import JournalistHeader from './JournalistHeader';
import JournalistSidebar from './JournalistSidebar';
import JournalistFooter from './JournalistFooter';

const API_BASE_URL = 'https://api.newztok.in';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editorKey, setEditorKey] = useState(Date.now());
  const [editorRef, setEditorRef] = useState(null);

  useEffect(() => {
    fetchNewsById();
  }, [id]);

  const getAuthToken = () => {
    // Check all possible storage locations for the token
    const storageLocations = [localStorage, sessionStorage];
    // Use the same key order as in EditorEditScreen to ensure consistency
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

  const fetchNewsById = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if we have data in localStorage from the PendingApprovals component
      const storedNews = localStorage.getItem('editNewsItem');
      let newsData = storedNews ? JSON.parse(storedNews) : null;
      
      // We'll use the stored data as initial values immediately to avoid blank screen
      if (newsData && newsData.id === parseInt(id)) {
        console.log('Using stored news data for initial values:', newsData);
        setInitialData(newsData);
      } else {
        console.log('No stored news data found or ID mismatch, will rely on API call');
      }
      
      // Get the auth token
      let token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      // Try alternative token locations if not found
      if (!token) {
        const alternatives = ['token', 'jwtToken', 'userToken', 'accessToken'];
        for (const key of alternatives) {
          const possibleToken = localStorage.getItem(key) || sessionStorage.getItem(key);
          if (possibleToken) {
            token = possibleToken;
            console.log(`Found token in ${key}`);
            break;
          }
        }
      }
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Configure axios headers with the token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Try to fetch news from the API using multiple approaches
      
      // 1. First attempt: Try to get all pending news and find our ID
      try {
        const allPendingNewsUrl = 'https://api.newztok.in/api/news/my-pending-news';
        console.log('Fetching all pending news from:', allPendingNewsUrl);
        
        const listResponse = await axios.get(allPendingNewsUrl, config);
        
        if (listResponse.status === 200 && listResponse.data) {
          console.log('Got pending news list:', listResponse.data);
          
          const newsList = listResponse.data.data || listResponse.data;
          if (Array.isArray(newsList)) {
            // Find the news with matching ID in the list
            const targetNews = newsList.find(item => item.id === parseInt(id));
            
            if (targetNews) {
              console.log('Found matching news in list:', targetNews);
              
              // Merge with existing data, prioritizing API data
              if (newsData) {
                const mergedData = {
                  ...newsData,
                  ...targetNews,
                  // Ensure these critical fields are preserved
                  featuredImage: targetNews.featuredImage || newsData.featuredImage || '',
                  state: targetNews.state || newsData.state || '',
                  district: targetNews.district || newsData.district || '',
                  category: targetNews.category || newsData.category || ''
                };
                console.log('Setting merged data:', mergedData);
                setInitialData(mergedData);
              } else {
                setInitialData(targetNews);
              }
              
              // Exit early as we found our data
              return;
            }
          }
        }
      } catch (listError) {
        console.log('Error fetching pending news list:', listError.message);
        // Continue to other methods if list approach fails
      }
      
      // 2. Second attempt: Try the individual endpoints if list approach failed
      const endpoints = [
        `https://api.newztok.in/api/news/my-pending-news`,  // Try base endpoint
        `https://api.newztok.in/api/news/my-pending-news/${id}`, // Try with ID
        `https://api.newztok.in/api/news/detail/${id}`,
        `https://api.newztok.in/api/news/${id}`,
        `https://api.newztok.in/api/news/view/${id}`,
        `https://api.newztok.in/api/my-pending-news/${id}`,
        `https://api.newztok.in/api/news/pending-news/${id}`,
        `https://api.newztok.in/api/news/pending/${id}`,
        `https://api.newztok.in/api/news/my-news/${id}`,
        `https://api.newztok.in/api/news/get/${id}`
      ];
      
      let apiData = null;
      let successfulEndpoint = null;
      let allErrors = [];
      
      // Try each endpoint
      for (const endpoint of endpoints) {
        if (apiData) break; // Stop if we already found data
        
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await axios.get(endpoint, config);
          
          if (response.status === 200 && response.data) {
            console.log(`Success with endpoint: ${endpoint}`, response.data);
            
            // If this is the base endpoint, we need to find our news in the list
            if (endpoint === 'https://api.newztok.in/api/news/my-pending-news') {
              const dataList = response.data.data || response.data;
              if (Array.isArray(dataList)) {
                const found = dataList.find(item => item.id === parseInt(id));
                if (found) {
                  apiData = found;
                  successfulEndpoint = `${endpoint} (found ID ${id} in list)`;
                }
              }
            } else {
              // For direct endpoints, use the response data
              const fetchedData = response.data.data || response.data;
              
              // If data has an id, it's likely a valid news object
              if (fetchedData && (fetchedData.id || fetchedData.title)) {
                console.log('Found valid news data from API');
                apiData = fetchedData;
                successfulEndpoint = endpoint;
                break;
              } else {
                console.log('Response contained no valid news data:', fetchedData);
                allErrors.push(`Endpoint ${endpoint} returned invalid data`);
              }
            }
          }
        } catch (error) {
          const errorMessage = `Endpoint ${endpoint} failed: ${error.message}`;
          console.log(errorMessage);
          allErrors.push(errorMessage);
          // Continue to next endpoint
        }
      }
      
      // If we got API data, use it to update our state and merge with existing data
      if (apiData) {
        console.log('Setting form data from API response via:', successfulEndpoint);
        if (newsData) {
          // Merge API data with localStorage data, prioritizing API data except for nulls
          const mergedData = {
            ...newsData,
            ...apiData,
            // Ensure these critical fields are preserved from localStorage if API returns null
            featuredImage: apiData.featuredImage || newsData.featuredImage || '',
            state: apiData.state || newsData.state || '',
            district: apiData.district || newsData.district || '',
            category: apiData.category || newsData.category || ''
          };
          console.log('Merged data:', mergedData);
          setInitialData(mergedData);
          
          // Update localStorage with the latest data
          localStorage.setItem('editNewsItem', JSON.stringify(mergedData));
        } else {
          setInitialData(apiData);
          localStorage.setItem('editNewsItem', JSON.stringify(apiData));
        }
      } else {
        console.log('All API endpoints failed:', allErrors);
        // If we have localStorage data, we'll just use that, otherwise, show an error
        if (!newsData) {
          setError('Could not load news data from API. Please try again or contact support.');
        } else {
          console.log('Falling back to localStorage data only');
          // Even without API data, we can still proceed with existing localStorage data
        }
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(`Failed to load news data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const setInitialData = (data) => {
    // Ensure we have clean data with fallbacks for missing fields
    // For empty strings, preserve them rather than replacing with fallbacks
    setTitle(data.title || '');
    setContent(data.content || '');
    setCategory(data.category || '');
    
    // Explicitly preserve empty strings for these critical fields
    setState(data.state !== undefined ? data.state : '');
    setDistrict(data.district !== undefined ? data.district : '');
    setFeaturedImage(data.featuredImage !== undefined ? data.featuredImage : '');
    
    console.log('Setting initial data with fields:');
    console.log('- Title:', data.title);
    console.log('- State:', data.state);
    console.log('- District:', data.district);
    console.log('- FeaturedImage:', data.featuredImage);
  };

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
        title: title,
        content: content,
        category: category || '',
        state: state || '',
        district: district || '',
        featuredImage: featuredImage || ''
      };

      console.log('Sending update request with data:', updateData);

      // Send PUT request to update the news
      const response = await axios.put(
        `${API_BASE_URL}/api/news/${id}`, 
        updateData,
        config
      );

      console.log('News updated successfully:', response.data);
      
      // Save to localStorage to preserve user's work and ensure PendingApprovals can access it
      const updatedData = {
        id: id,
        title: title,
        content: content,
        category: category || '',
        state: state || '',
        district: district || '',
        featuredImage: featuredImage || '',
        updatedAt: new Date().toISOString(),
        _updatedLocally: true // Flag to highlight updated items in PendingApprovals
      };
      
      // Store in localStorage for access in PendingApprovals with a specific key pattern
      localStorage.setItem(`updatedNewsItem_${id}`, JSON.stringify(updatedData));
      console.log('Saved editor updates to localStorage:', updatedData);
      
      // Update cached pending news to reflect the changes immediately
      try {
        const cachedPendingNews = localStorage.getItem('cached_pending_news');
        if (cachedPendingNews) {
          const pendingNewsArray = JSON.parse(cachedPendingNews);
          // Find and update the item in the cached array
          const updatedArray = pendingNewsArray.map(item => {
            if (item.id == id) {
              return { ...item, ...updatedData };
            }
            return item;
          });
          // Store the updated array back in cache
          localStorage.setItem('cached_pending_news', JSON.stringify(updatedArray));
          console.log('Updated cached pending news with edited data');
        }
      } catch (cacheError) {
        console.warn('Failed to update cached pending news:', cacheError);
      }

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
      
      // Redirect after short delay
      setTimeout(() => {
        document.body.removeChild(successMessage);
        
        // Clear any temporary edit data before redirecting
        localStorage.removeItem('editNewsItem');
        
        // Set a flag to tell PendingApprovals to refresh its data
        localStorage.setItem('pendingApprovals_refresh', 'true');
        
        navigate('/journalist/pendingApprovals', { replace: true });
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
      
      // Remove error message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditorChange = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  const handleEditorInit = (evt, editor) => {
    setEditorRef(editor);
  };
  
  const handleCancel = () => {
    console.log('Cancel button clicked, redirecting to Home');
    
    // Clear the stored news item
    localStorage.removeItem('editNewsItem');
    localStorage.removeItem('editNewsId');
    
    // Go back to the home screen - using replace to prevent back button issues
    navigate('/journalist/home', { replace: true });
  };

  // Function to render the edit form content
  const renderEditContent = () => {
    if (loading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%'
        }}>
          <div>
            <h2>Loading...</h2>
            <p>Fetching news details</p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '5px' 
            }}>
              Edit Post
            </h2>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '16px', 
              marginTop: '5px' 
            }}>
              Modify your news content and submit for re-approval
            </p>
          </div>

          {/* Buttons at top right */}
          <div style={{ 
            position: 'absolute', 
            top: '120px', // Changed from 90px to 120px to move buttons down
            right: '30px',
            display: 'flex',
            gap: '10px'
          }}>
            <button
              onClick={handleCancel}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#1f2937', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Updating...' : 'Update Post'}
            </button>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: '#FEE2E2', 
              color: '#B91C1C', 
              padding: '12px 16px', 
              borderRadius: '6px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: '3' }}>
              {/* Post Title/Headline */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  htmlFor="title"
                  style={{ 
                    display: 'block', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    fontSize: '16px',
                    color: '#111827'
                  }}
                >
                  Post Title/Headline
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Write title here..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Featured Image */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  style={{ 
                    display: 'block', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    fontSize: '16px',
                    color: '#111827'
                  }}
                >
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
                      value={featuredImage || ''}
                      onChange={(e) => setFeaturedImage(e.target.value)}
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
                      id="featuredImageUpload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedFile(file);
                          console.log('Selected file:', file.name);
                          // Create a preview URL for the image
                          const previewUrl = URL.createObjectURL(file);
                          setFeaturedImage(previewUrl);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    <label 
                      htmlFor="featuredImageUpload"
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
                      {selectedFile ? selectedFile.name : 'No file selected'}
                    </span>
                  </div>
                  
                  {/* Image Preview */}
                  {selectedFile ? (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ fontSize: '14px', color: '#10B981', marginBottom: '8px', fontWeight: '500' }}>
                        ✓ New image selected (will be uploaded when you save)
                      </p>
                      <img 
                        src={URL.createObjectURL(selectedFile)}
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
                  ) : featuredImage && (
                    <div style={{ marginTop: '10px' }}>
                      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Current image:</p>
                      <img 
                        src={featuredImage.startsWith('http') || featuredImage.startsWith('blob:') 
                          ? featuredImage 
                          : `https://api.newztok.in${featuredImage.startsWith('/') ? featuredImage : '/' + featuredImage}`
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

              {/* Content Editor using TinyMCE */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  htmlFor="content"
                  style={{ 
                    display: 'block', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    fontSize: '16px',
                    color: '#111827'
                  }}
                >
                  Content
                </label>
                <Editor
                  apiKey="omxjaluaxpgfpa6xkfadimoprrirfmhozsrtpb3o1uimu4c5"
                  value={content}
                  onEditorChange={(newContent, editor) => {
                    // Get current selection
                    const selection = editor.selection.getSel();
                    if (selection) {
                      // Store the current cursor position
                      const range = selection.getRangeAt(0);
                      const bookmark = editor.selection.getBookmark();
                      
                      // Update content
                      setContent(newContent);
                      
                      // Restore cursor position
                      editor.selection.moveToBookmark(bookmark);
                    } else {
                      setContent(newContent);
                    }
                  }}
                  init={{
                    height: 500,
                    menubar: true,
                    branding: false,
                    promotion: false,
                    plugins: [
                      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                      'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Editor'
                  }}
                />
              </div>

              {isSaving && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#E5E7EB', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: '60%', 
                      height: '100%', 
                      backgroundColor: '#4F46E5',
                      animation: 'progress 1.5s infinite linear'
                    }} />
                  </div>
                  <p style={{ 
                    textAlign: 'center', 
                    fontSize: '14px', 
                    color: '#6B7280',
                    marginTop: '8px'
                  }}>
                    Saving changes...
                  </p>
                  <style>
                    {`
                      @keyframes progress {
                        0% { width: 0%; }
                        50% { width: 60%; }
                        100% { width: 100%; }
                      }
                    `}
                  </style>
                </div>
              )}
            </div>

            {/* Organize sidebar */}
            <div style={{ flex: '1' }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '6px',
                border: '1px solid #e5e7eb' 
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  marginTop: 0,
                  marginBottom: '16px',
                  color: '#111827'
                }}>
                  Organize
                </h3>
                
                {/* Category */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="category"
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#111827',
                      marginBottom: '8px',
                      textTransform: 'uppercase'
                    }}
                  >
                    CATEGORY
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px top 50%',
                      backgroundSize: '12px auto',
                      paddingRight: '28px'
                    }}
                  >
                    <option value="">---------</option>
                    <option value="trending">ट्रेंडिंग | Trending</option>
                    <option value="national">राष्ट्रीय | National</option>
                    <option value="international">अंतरराष्ट्रीय | International</option>
                    <option value="sports">खेल | Sports</option>
                    <option value="entertainment">मनोरंजन | Entertainment</option>
                  </select>
                </div>

                {/* State */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="state"
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#111827',
                      marginBottom: '8px',
                      textTransform: 'uppercase'
                    }}
                  >
                    STATE
                  </label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setDistrict(''); // Reset district when state changes
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px top 50%',
                      backgroundSize: '12px auto',
                      paddingRight: '28px'
                    }}
                  >
                    <option value="">---------</option>
                    <option value="bihar">बिहार | Bihar</option>
                    <option value="jharkhand">झारखंड | Jharkhand</option>
                    <option value="up">उत्तर प्रदेश | Uttar Pradesh</option>
                  </select>
                </div>

                {/* District */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="district"
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#111827',
                      marginBottom: '8px',
                      textTransform: 'uppercase'
                    }}
                  >
                    DISTRICT
                  </label>
                  <select
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!state}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      appearance: 'none',
                      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px top 50%',
                      backgroundSize: '12px auto',
                      paddingRight: '28px',
                      opacity: state ? 1 : 0.6
                    }}
                  >
                    <option value="">---------</option>
                    {state === 'bihar' && (
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
                    {state === 'jharkhand' && (
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
                    {state === 'up' && (
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
        </div>
      </div>
    );
  };

  // Return the overall layout with Journalist Header, Sidebar, and Footer
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <JournalistHeader />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '250px', backgroundColor: '#1e2029' }}>
          <JournalistSidebar 
            activeSection="editPost"
            onSectionChange={(section) => {
              console.log('Sidebar section clicked:', section);
              
              // Check if there are unsaved changes
              const hasUnsavedChanges = isSaving;
              
              if (hasUnsavedChanges) {
                // Prevent navigation if currently saving
                alert('Please wait until the current save operation is complete');
                return;
              }
              
              // Clear localStorage data to prevent stale data when navigating away
              if (section !== 'editPost') {
                localStorage.removeItem('editNewsItem');
              }
              
              // Handle navigation based on the section with clear destinations
              switch(section) {
                case 'overview':
                  console.log('Navigating to Overview/Home');
                  navigate('/journalist/home');
                  break;
                case 'standardPost':
                  console.log('Navigating to Standard Post');
                  navigate('/journalist/standardPost');
                  break;
                case 'videoPost':
                  console.log('Navigating to Video Post');
                  navigate('/journalist/videoPost');
                  break;
                case 'posts':
                  console.log('Navigating to Posts');
                  navigate('/journalist/posts');
                  break;
                case 'pendingApprovals':
                  console.log('Navigating to Pending Approvals');
                  navigate('/journalist/pendingApprovals');
                  break;
                case 'rejected':
                  console.log('Navigating to Rejected');
                  navigate('/journalist/rejected');
                  break;
                default:
                  console.log(`Navigating to ${section}`);
                  navigate(`/journalist/${section}`);
              }
            }}
          />
        </div>
        
        <main style={{ flex: 1, overflow: 'auto', backgroundColor: '#f8fafc' }}>
          {renderEditContent()}
        </main>
      </div>
      
      <JournalistFooter />
    </div>
  );
};

export default EditPost; 