import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import EditorHeader from './EditorHeader';
import EditorFooter from './EditorFooter';
import EditorSidebar from './EditorSidebar';
import './editor.css';

// API base URL configuration
const API_BASE_URL = 'https://api.newztok.in';

// Define location data structure (same as in EditorEditScreen)
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
    { hindi: "पश्चिमी सिंहभूम", english: "West Singhbhum", value: "west-singhbhum" },
    { hindi: "डुमका", english: "Dumka", value: "dumka" },
    { hindi: "गढ़वा", english: "Garhwa", value: "garhwa" },
    { hindi: "गोड्डा", english: "Godda", value: "godda" }
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
  up: [
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

const ReEditPost = () => {
  // Parameters and navigation
  const { newsId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State variables for data
  const [newsData, setNewsData] = useState({
    title: '',
    content: '',
    category: '',
    state: '',
    district: '',
    featuredImage: '',
    videoUrl: '',
    youtubeUrl: '',
    contentType: 'standard',
    videoPath: '',
    video: '',
    featuredVideo: '',
    isFeatured: false
  });
  
  // UI state variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('posts');
  const [isVideoContent, setIsVideoContent] = useState(false);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploadMethod, setVideoUploadMethod] = useState('file'); // 'file' or 'youtube'
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [editorKey, setEditorKey] = useState(Date.now());

  // Load data from location state or fetch from API
  useEffect(() => {
    const loadPostData = async () => {
      try {
        setLoading(true);
        
        // Check if we have data from navigation state
        if (location.state && location.state.newsData) {
          console.log('Using data from navigation state:', location.state.newsData);
          const navData = location.state.newsData;
          
          // Check if this is a video post
          const isVideo = navData.contentType === 'video' || 
                         !!navData.youtubeUrl || 
                         !!navData.videoPath || 
                         !!navData.video ||
                         !!navData.videoUrl || 
                         !!navData.featuredVideo;
          
          // Set the correct video upload method based on data
          if (navData.youtubeUrl) {
            setVideoUploadMethod('youtube');
          } else if (navData.videoPath || navData.video) {
            setVideoUploadMethod('file');
          }
          
          setNewsData(navData);
          setIsVideoContent(isVideo);
        } else {
          // Fetch from API using the newsId
          const token = getAuthToken();
          if (!token) {
            throw new Error('No authentication token found');
          }

          const config = { headers: { 'Authorization': `Bearer ${token}` } };
          const response = await axios.get(`${API_BASE_URL}/api/news/${newsId}`, config);
          
          const apiData = response.data;
          console.log('Fetched news data from API:', apiData);
          
          // Process the API data
          const processedData = {
            id: apiData.id || apiData._id,
            title: apiData.title || '',
            content: apiData.content || '',
            category: apiData.category || '',
            state: apiData.state || '',
            district: apiData.district || '',
            featuredImage: apiData.featuredImage || apiData.image || '',
            contentType: apiData.contentType || 'standard',
            youtubeUrl: apiData.youtubeUrl || '',
            videoPath: apiData.videoPath || apiData.video || '',
            video: apiData.video || apiData.videoPath || '',
            videoUrl: apiData.videoUrl || '',
            featuredVideo: apiData.featuredVideo || '',
            isFeatured: apiData.isFeatured || apiData.featured || false
          };
          
          // Check if this is a video post
          const isVideo = processedData.contentType === 'video' || 
                         !!processedData.youtubeUrl || 
                         !!processedData.videoPath || 
                         !!processedData.video ||
                         !!processedData.videoUrl || 
                         !!processedData.featuredVideo;
          
          // Set the correct video upload method based on data
          if (processedData.youtubeUrl) {
            setVideoUploadMethod('youtube');
          } else if (processedData.videoPath || processedData.video) {
            setVideoUploadMethod('file');
          }
          
          setNewsData(processedData);
          setIsVideoContent(isVideo);
        }
      } catch (err) {
        console.error('Error loading post data:', err);
        setError(`Failed to load post data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadPostData();
  }, [location, newsId]);

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setNewsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      setUpdateLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Check if we need to use FormData (for file uploads)
      const hasNewVideoFile = isVideoContent && videoUploadMethod === 'file' && selectedVideoFile;
      
      if (hasNewVideoFile) {
        // Use FormData for file uploads
        const formData = new FormData();
        
        // Add basic fields
        formData.append('id', newsId);
        formData.append('title', newsData.title);
        formData.append('content', newsData.content);
        formData.append('category', newsData.category || '');
        formData.append('state', newsData.state || '');
        formData.append('district', newsData.district || '');
        formData.append('featuredImage', newsData.featuredImage || '');
        formData.append('contentType', isVideoContent ? 'video' : 'standard');
        formData.append('status', 'approved');
        formData.append('isFeatured', newsData.isFeatured || false);
        
        // Add video file
        formData.append('video', selectedVideoFile);
        
        // Config for FormData
        const formConfig = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        };
        
        console.log('Saving changes with video upload...');
        
        // Make the API request with FormData
        const response = await axios.put(
          `${API_BASE_URL}/api/news/re-edit/${newsId}`,
          formData,
          formConfig
        );
        
        console.log('Update response:', response.data);
      } else {
        // Use regular JSON for non-file updates
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // Prepare the update payload - exactly matching EditorEditScreen format
        const updatedData = {
          id: newsId, // Include the ID explicitly
          title: newsData.title,
          content: newsData.content,
          category: newsData.category || '',
          state: newsData.state || '',
          district: newsData.district || '',
          featuredImage: newsData.featuredImage || '',
          contentType: isVideoContent ? 'video' : 'standard',
          status: 'approved'
        };
        
        // Handle video content exactly like EditorEditScreen
        if (isVideoContent) {
          if (videoUploadMethod === 'youtube') {
            updatedData.youtubeUrl = newsData.youtubeUrl || '';
          } else {
            updatedData.videoPath = newsData.videoPath || '';
            updatedData.video = newsData.video || '';
          }
        }
        
        // Include featured status
        updatedData.isFeatured = newsData.isFeatured || false;
        
        console.log('Saving changes with payload:', updatedData);
        
        // Make the API request to the re-edit endpoint
        const response = await axios.put(
          `${API_BASE_URL}/api/news/re-edit/${newsId}`,
          updatedData,
          config
        );
        
        console.log('Update response:', response.data);
      }
      
      // Show success message
      setSuccessMessage('Post updated successfully');
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/editor/posts');
      }, 1500);
      
    } catch (err) {
      console.error('Error updating post:', err);
      setError(`Failed to update post: ${err.message}`);
    } finally {
      setUpdateLoading(false);
      setUploadProgress(0);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate('/editor/posts');
  };

  // Handle section change in sidebar
  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/editor/${section}`);
  };

  // Get video URL for display
  const getVideoUrl = (path) => {
    if (!path) return '';
    
    // If path already has the API base URL, return as is
    if (path.startsWith('http')) {
      return path;
    }
    
    // If path starts with a slash, append to API base URL
    if (path.startsWith('/')) {
      return `${API_BASE_URL}${path}`;
    }
    
    // Otherwise, append with a slash
    return `${API_BASE_URL}/${path}`;
  };

  // Function to handle video file selection
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log('Selected video file:', file);
    setSelectedVideoFile(file);
    
    // Create a preview URL for the video
    const videoObjectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(videoObjectUrl);
    
    // Update the form state
    setVideoUploadMethod('file');
  };

  // Function to get display-friendly video path
  const getDisplayVideoPath = (videoData) => {
    const videoPath = videoData.videoPath || videoData.video || '';
    if (!videoPath) return 'No video file selected';
    
    // Extract filename from path
    const pathParts = videoPath.split('/');
    return pathParts[pathParts.length - 1];
  };

  // Function to handle YouTube URL changes
  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    handleInputChange('youtubeUrl', url);
    setVideoUploadMethod('youtube');
  };

  // Function to handle image file selection
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log('Selected image file:', file);
    setSelectedImageFile(file);
    
    // Create a preview URL for the image
    const imageObjectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(imageObjectUrl);
  };

  // Get image URL for display
  const getImageUrl = (path) => {
    if (!path) return '';
    
    // If path already has the API base URL or is a full URL, return as is
    if (path.startsWith('http')) {
      return path;
    }
    
    // If path starts with a slash, append to API base URL
    if (path.startsWith('/')) {
      return `${API_BASE_URL}${path}`;
    }
    
    // Otherwise, append with a slash
    return `${API_BASE_URL}/${path}`;
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
          ) : (
            <>
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
              
              {/* Page header */}
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
                    onClick={handleSaveChanges}
                    disabled={updateLoading}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
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
                          width: '16px',
                          height: '16px',
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

              {/* Content type selector */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    Content Type
                  </label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div 
                      onClick={() => {
                        setIsVideoContent(false);
                        handleInputChange('contentType', 'standard');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        backgroundColor: !isVideoContent ? '#eff6ff' : 'transparent',
                        border: `1px solid ${!isVideoContent ? '#3b82f6' : '#d1d5db'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: `2px solid ${!isVideoContent ? '#3b82f6' : '#d1d5db'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {!isVideoContent && (
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#3b82f6'
                          }}></div>
                        )}
                      </div>
                      <span style={{ color: !isVideoContent ? '#3b82f6' : '#374151' }}>Standard Post</span>
                    </div>
                    <div 
                      onClick={() => {
                        setIsVideoContent(true);
                        handleInputChange('contentType', 'video');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        backgroundColor: isVideoContent ? '#eff6ff' : 'transparent',
                        border: `1px solid ${isVideoContent ? '#3b82f6' : '#d1d5db'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: `2px solid ${isVideoContent ? '#3b82f6' : '#d1d5db'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isVideoContent && (
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#3b82f6'
                          }}></div>
                        )}
                      </div>
                      <span style={{ color: isVideoContent ? '#3b82f6' : '#374151' }}>Video Post</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Two column layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Main content column */}
                <div>
                  {/* Post edit form */}
                  <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    marginBottom: '24px'
                  }}>
                    {/* Post title */}
                    <div style={{ marginBottom: '24px' }}>
                      <label 
                        htmlFor="title"
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#111827'
                        }}
                      >
                        {isVideoContent ? 'Video Title' : 'Post Title'}
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={newsData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '16px'
                        }}
                        placeholder={isVideoContent ? "Enter video title" : "Enter post title"}
                      />
                    </div>
                    
                    {/* Featured Image Upload */}
                    <div style={{ marginBottom: '24px' }}>
                      <label 
                        htmlFor="featuredImage"
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#111827'
                        }}
                      >
                        Featured Image
                      </label>
                      <div style={{ 
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '12px',
                        backgroundColor: '#f9fafb'
                      }}>
                        <input
                          id="featuredImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          style={{ display: 'none' }}
                        />
                        <div style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div>
                            <label
                              htmlFor="featuredImage"
                              style={{
                                display: 'inline-block',
                                padding: '8px 16px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                marginRight: '12px'
                              }}
                            >
                              Choose Image
                            </label>
                            <span style={{ color: '#6b7280', fontSize: '14px' }}>
                              {selectedImageFile ? selectedImageFile.name : 
                              newsData.featuredImage ? 
                              (newsData.featuredImage.split('/').pop() || 'Current image') : 
                              'No image selected'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Image preview */}
                        {(imagePreviewUrl || newsData.featuredImage) && (
                          <div style={{ marginTop: '16px' }}>
                            <img
                              src={imagePreviewUrl || getImageUrl(newsData.featuredImage)}
                              alt="Featured"
                              style={{ 
                                maxWidth: '100%', 
                                maxHeight: '200px', 
                                borderRadius: '4px',
                                objectFit: 'contain'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Video upload section - only shown for video content */}
                    {isVideoContent && (
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ 
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div 
                            onClick={() => setVideoUploadMethod('file')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              backgroundColor: videoUploadMethod === 'file' ? '#eff6ff' : 'transparent',
                              border: `1px solid ${videoUploadMethod === 'file' ? '#3b82f6' : '#d1d5db'}`,
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              border: `2px solid ${videoUploadMethod === 'file' ? '#3b82f6' : '#d1d5db'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {videoUploadMethod === 'file' && (
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#3b82f6'
                                }}></div>
                              )}
                            </div>
                            <span style={{ color: videoUploadMethod === 'file' ? '#3b82f6' : '#374151' }}>Upload Video</span>
                          </div>
                          
                          <div 
                            onClick={() => setVideoUploadMethod('youtube')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              backgroundColor: videoUploadMethod === 'youtube' ? '#eff6ff' : 'transparent',
                              border: `1px solid ${videoUploadMethod === 'youtube' ? '#3b82f6' : '#d1d5db'}`,
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              border: `2px solid ${videoUploadMethod === 'youtube' ? '#3b82f6' : '#d1d5db'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {videoUploadMethod === 'youtube' && (
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#3b82f6'
                                }}></div>
                              )}
                            </div>
                            <span style={{ color: videoUploadMethod === 'youtube' ? '#3b82f6' : '#374151' }}>YouTube URL</span>
                          </div>
                        </div>
                        
                        {videoUploadMethod === 'file' ? (
                          <div>
                            <label 
                              htmlFor="videoFile"
                              style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                              }}
                            >
                              Upload Video File
                            </label>
                            <div style={{ 
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              padding: '12px',
                              backgroundColor: '#f9fafb'
                            }}>
                              <input
                                id="videoFile"
                                type="file"
                                accept="video/*"
                                onChange={handleVideoFileChange}
                                style={{ display: 'none' }}
                              />
                              <div style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}>
                                <div>
                                  <label
                                    htmlFor="videoFile"
                                    style={{
                                      display: 'inline-block',
                                      padding: '8px 16px',
                                      backgroundColor: '#3b82f6',
                                      color: 'white',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      marginRight: '12px'
                                    }}
                                  >
                                    Browse Files
                                  </label>
                                  <span style={{ color: '#6b7280', fontSize: '14px' }}>
                                    {selectedVideoFile ? selectedVideoFile.name : 
                                     (newsData.videoPath || newsData.video) ? 
                                     getDisplayVideoPath(newsData) : 'No file selected'}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Video preview */}
                              {(videoPreviewUrl || newsData.videoPath || newsData.video) && (
                                <div style={{ marginTop: '16px' }}>
                                  <video
                                    controls
                                    key={videoPreviewUrl || newsData.videoPath || newsData.video}
                                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }}
                                    src={videoPreviewUrl || getVideoUrl(newsData.videoPath || newsData.video)}
                                  />
                                </div>
                              )}
                              
                              {/* Upload progress bar */}
                              {uploadProgress > 0 && uploadProgress < 100 && (
                                <div style={{ marginTop: '12px' }}>
                                  <div style={{ 
                                    height: '4px', 
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '2px',
                                    overflow: 'hidden'
                                  }}>
                                    <div 
                                      style={{ 
                                        height: '100%', 
                                        width: `${uploadProgress}%`,
                                        backgroundColor: '#3b82f6'
                                      }}
                                    />
                                  </div>
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    marginTop: '4px'
                                  }}>
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label 
                              htmlFor="youtubeUrl"
                              style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                              }}
                            >
                              YouTube Video URL
                            </label>
                            <input
                              id="youtubeUrl"
                              type="url"
                              value={newsData.youtubeUrl || ''}
                              onChange={handleYoutubeUrlChange}
                              placeholder="https://www.youtube.com/watch?v=..."
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px'
                              }}
                            />
                            
                            {/* YouTube preview */}
                            {newsData.youtubeUrl && (
                              <div style={{ marginTop: '16px' }}>
                                <iframe
                                  width="100%"
                                  height="315"
                                  src={`https://www.youtube.com/embed/${newsData.youtubeUrl.split('v=')[1]?.split('&')[0]}`}
                                  title="YouTube video player"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  style={{ borderRadius: '4px' }}
                                ></iframe>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Post content */}
                    <div style={{ marginBottom: '24px' }}>
                      <label 
                        htmlFor="content"
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#111827'
                        }}
                      >
                        {isVideoContent ? 'Video Description' : 'Content'}
                      </label>
                      <Editor
                        apiKey="74ezfl12d3caazs304xdpxge6jtfxivf5ps8xuc8x259fgn4"
                        value={newsData.content || ''}
                        init={{
                          height: 500,
                          menubar: true,
                          plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                          ],
                          toolbar:
                            'undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'
                        }}
                        onEditorChange={(content) => handleInputChange('content', content)}
                      />
                    </div>
                  </div>
                </div>

                {/* Organize section */}
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
                    
                    {/* Category dropdown */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#111827',
                        marginBottom: '8px',
                        textTransform: 'uppercase'
                      }}>
                        CATEGORY
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          id="category"
                          value={newsData.category || ''}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            appearance: 'none',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">---------</option>
                          <option value="national">राष्ट्रीय | National</option>
                          <option value="international">अंतरराष्ट्रीय | International</option>
                          <option value="sports">खेल | Sports</option>
                          <option value="entertainment">मनोरंजन | Entertainment</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* State dropdown */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#111827',
                        marginBottom: '8px',
                        textTransform: 'uppercase'
                      }}>
                        STATE
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          id="state"
                          value={newsData.state || ''}
                          onChange={(e) => {
                            handleInputChange('state', e.target.value);
                            handleInputChange('district', ''); // Reset district when state changes
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            appearance: 'none',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">---------</option>
                          <option value="bihar">बिहार | Bihar</option>
                          <option value="jharkhand">झारखंड | Jharkhand</option>
                          <option value="up">उत्तर प्रदेश | Uttar Pradesh</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* District dropdown */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#111827',
                        marginBottom: '8px',
                        textTransform: 'uppercase'
                      }}>
                        DISTRICT
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          id="district"
                          value={newsData.district || ''}
                          onChange={(e) => handleInputChange('district', e.target.value)}
                          disabled={!newsData.state}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            appearance: 'none',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            backgroundColor: newsData.state ? 'white' : '#f3f4f6',
                            fontSize: '14px',
                            opacity: newsData.state ? 1 : 0.6
                          }}
                        >
                          <option value="">---------</option>
                          {newsData.state && locationData[newsData.state]?.map((district) => (
                            <option key={district.value} value={district.value}>
                              {district.hindi} | {district.english}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      
      <EditorFooter />
    </div>
  );
};

export default ReEditPost; 