import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://13.234.42.114:3333';

axios.defaults.timeout = 120000;

const StandardPost = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [journalistProfile, setJournalistProfile] = useState(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  // Function to get auth token
  const getAuthToken = () => {
    const storageLocations = [localStorage, sessionStorage];
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

  // Fetch journalist profile on component mount
  useEffect(() => {
    const fetchJournalistProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setError('Authentication token not found. Please login again.');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/users/my-profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Journalist profile:', response.data);
        setJournalistProfile(response.data);
        
        // Set state and district from journalist profile
        if (response.data.assignState) {
          setState(response.data.assignState);
          console.log('Setting assigned state:', response.data.assignState);
        }
        
        if (response.data.assignDistrict) {
          setDistrict(response.data.assignDistrict);
          console.log('Setting assigned district:', response.data.assignDistrict);
        }
      } catch (err) {
        console.error('Failed to fetch journalist profile:', err);
        // Don't show error to user, just log it
      }
    };

    fetchJournalistProfile();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB. Please select a smaller image.');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleDiscard = () => {
    setTitle('');
    setFile(null);
    setContent('');
    setCategory('');
    setState('');
    setDistrict('');
    setError('');
    setUploadProgress(0);
    if (editorRef.current) {
      editorRef.current.setContent('');
    }
  };

  const handleSaveDraft = () => {
    // Save draft logic here
    console.log('Saving draft...');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get content from editor if available before validation
    let editorContent = '';
    if (editorRef.current) {
      editorContent = editorRef.current.getContent();
    }
    
    // Ensure the content has actual content and not just empty HTML tags
    const actualContent = editorContent || content;
    const hasContent = actualContent && !/<p>\s*<\/p>$/.test(actualContent) && actualContent !== '<p></p>';
    
    // Validate form fields
    if (!title || title.trim() === '') {
      setError('Please enter a title for your post');
      return;
    }
    
    if (!hasContent || actualContent.trim() === '') {
      setError('Please add some content to your post');
      return;
    }
    
    if (!category || category.trim() === '') {
      setError('Please select a category for your post');
      return;
    }
    
    if (!file) {
      setError('Please select a featured image');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Get the auth token
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      // Clean the token - remove any quotes or whitespace that might cause issues
      const cleanToken = token.trim().replace(/^["'](.*)["']$/, '$1');
      
      // Log token information for debugging (safely)
      console.log('Token length:', cleanToken.length);
      console.log('Token format check:', cleanToken.includes('.') ? 'Contains periods (likely JWT)' : 'No periods (may not be JWT)');
      console.log('Token prefix:', cleanToken.substring(0, 10) + '...');

      // Set up request headers with token - moved outside try block to fix scope issue
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${cleanToken}`);
      // No need to set Content-Type for FormData, browser will set it with boundary

      // Make the API request with different content type to avoid FormData issues
      try {
        console.log('Attempting direct JSON POST without FormData');
        
        // First convert the file to base64 for sending as JSON
        const reader = new FileReader();
        
        // Set up a promise to handle the FileReader's async nature
        const fileToBase64 = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
        
        // Get base64 string from the file
        const fileBase64 = await fileToBase64;
        
        // Create a JSON object without any isFeatured field
        const postData = {
          title: title.trim(),
          content: actualContent.trim(),
          category,
          contentType: "standard",
          featuredImageBase64: fileBase64,
          fileType: file.type,
          fileName: file.name
        };
        
        // Add state and district from journalist profile if not explicitly changed
        postData.state = state;
        postData.district = district;
        
        // Show the upload is starting
        setUploadProgress(10);
        
        // Set JSON headers
        const jsonHeaders = new Headers();
        jsonHeaders.append("Authorization", `Bearer ${cleanToken}`);
        jsonHeaders.append("Content-Type", "application/json");
        
        // Make the fetch request with JSON data
        const response = await fetch("http://13.234.42.114:3333/api/news/create", {
          method: "POST",
          headers: jsonHeaders,
          body: JSON.stringify(postData),
          redirect: "follow"
        });
        
        setUploadProgress(90);
        
        // Check if response is ok
        if (!response.ok) {
          // Get response text
          const errorText = await response.text();
          console.error(`HTTP error! Status: ${response.status}`, errorText);
          
          // Parse error text if possible
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { message: errorText };
          }
          
          throw {
            status: response.status,
            statusText: response.statusText,
            data: errorData
          };
        }
        
        // Get response data
        const resultText = await response.text();
        let result;
        try {
          result = JSON.parse(resultText);
        } catch (e) {
          result = { message: resultText };
        }
        
        console.log('Post created successfully:', result);
        setUploadProgress(100);
        
        // Handle success
        handleDiscard();
        alert('🎉 Success! Your post has been created and is pending review.');
        navigate('/journalist/pendingApprovals');
        
      } catch (fetchError) {
        console.error('Fetch request failed:', fetchError);
        
        // Extract error details for diagnosis
        let errorDetails = '';
        if (fetchError.data) {
          if (typeof fetchError.data === 'object') {
            errorDetails = JSON.stringify(fetchError.data);
          } else {
            errorDetails = String(fetchError.data);
          }
        }
        
        // If getting isFeatured errors, try a modified approach without that field
        if (errorDetails.includes("Unknown column 'isFeatured'")) {
          console.log('Detected isFeatured column error, trying alternative approach');
          
          try {
            // Modified approach: Convert file to base64 again if needed
            let fileBase64 = null;
            if (file) {
              const reader = new FileReader();
              fileBase64 = await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
              });
            }
            
            // Create payload WITHOUT the isFeatured field that's causing the error
            const fixedPostData = {
              title: title.trim(),
              content: actualContent.trim(),
              category,
              contentType: "standard",
              // Send image data only if we have it
              ...(fileBase64 ? {
                featuredImageBase64: fileBase64,
                fileType: file.type,
                fileName: file.name
              } : {})
            };
            
            // Add state and district from journalist profile if not explicitly changed
            fixedPostData.state = state;
            fixedPostData.district = district;
            
            console.log('Trying request with fixed payload (no isFeatured field)');
            setUploadProgress(30);
            
            const response = await axios.post(
              "http://13.234.42.114:3333/api/news/create", 
              fixedPostData,
              {
                headers: {
                  'Authorization': `Bearer ${cleanToken}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log('Post created with fixed approach:', response.data);
            setUploadProgress(100);
            handleDiscard();
            alert('🎉 Success! Your post has been created and is pending review.');
            navigate('/journalist/pendingApprovals');
            return; // Exit the function after successful submission
            
          } catch (fixedError) {
            console.error('Fixed approach failed:', fixedError);
            // Continue to the minimal approach as a fallback
          }
          
          // If the fixed approach still failed, try the absolute minimal approach
          console.log('Trying minimal approach with direct axios POST');
          
          try {
            // Use axios for a different approach
            const response = await axios.post(
              "http://13.234.42.114:3333/api/news/create", 
              {
                title: title.trim(),
                content: actualContent.trim(),
                category: category,
                // No other fields at all
              },
              {
                headers: {
                  'Authorization': `Bearer ${cleanToken}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log('Post created with minimal fields:', response.data);
            handleDiscard();
            alert('Post created with minimal information. You may need to add the image later.');
            navigate('/journalist/pendingApprovals');
            
          } catch (minimalError) {
            console.error('Even minimal approach failed:', minimalError);
            throw new Error(`Server database issue: ${minimalError.message}`);
          }
        } else {
          throw fetchError;
        }
      }
      
    } catch (err) {
      console.error('API request failed:', err);
      
      // Extract detailed error information
      let errorMessage = 'Failed to create post';
      let serverResponse = null;
      
      if (err.response) {
        // The server responded with a status code outside of 2xx range
        console.error('Server Error Details:', {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        });
        
        serverResponse = err.response.data;
        
        if (err.response.status === 500) {
          errorMessage = 'Server Error (500): The server encountered an internal error. This is not your fault.';
          
          // Provide more detailed error information if available
          if (err.response.data && typeof err.response.data === 'object') {
            if (err.response.data.message) {
              errorMessage += ` Details: ${err.response.data.message}`;
            }
            if (err.response.data.error) {
              errorMessage += ` Error: ${err.response.data.error}`;
            }
          }
          
          // Suggest potential fixes for common issues
          errorMessage += '\n\nPossible solutions:\n';
          errorMessage += '• Try reducing the image file size\n';
          errorMessage += '• Check if the title contains special characters\n';
          errorMessage += '• Try logging out and back in again\n';
          errorMessage += '• Wait a few minutes and try again';
        } else if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = 'Authentication Error: Your session may have expired. Please log in again.';
        } else if (err.response.status === 413) {
          errorMessage = 'File Too Large: The image you are trying to upload is too large.';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = `Error (${err.response.status}): ${err.response.data.message}`;
        } else {
          errorMessage = `Error (${err.response.status}): ${err.response.statusText || 'Unknown error'}`;
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Request Error:', {
          request: err.request,
          message: err.message
        });
        errorMessage = 'Network Error: No response received from server. Please check your internet connection.';
      } else {
        // Something happened in setting up the request
        console.error('Error Message:', err.message);
        errorMessage = `Error: ${err.message}`;
      }
      
      // Display error message to user
      setError(errorMessage);
      
      // If it's a server error, also show debug info button
      if (serverResponse) {
        console.log('Full server response:', serverResponse);
      }
      
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '5px' }}>Create a Standard Post</h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Create and publish news content for the platform</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#1f2937', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={handleDiscard}
            disabled={loading}
          >
            Discard
          </button>
          <button 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: 'white', 
              color: '#4f46e5', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={handleSaveDraft}
            disabled={loading}
          >
            Save Draft
          </button>
          <button 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#4f46e5', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              pointerEvents: loading ? 'none' : 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && (
              <div style={{ 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                border: '2px solid rgba(255,255,255,0.3)', 
                borderTopColor: 'white',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '16px', 
          borderRadius: '6px',
          marginBottom: '20px',
          maxHeight: error.length > 200 ? '200px' : 'auto',
          overflow: error.length > 200 ? 'auto' : 'visible'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
            {error.includes('Server Error') ? 'Server Error Detected' : 'Error'}
          </div>
          <div style={{ 
            whiteSpace: 'pre-line',  // Preserves line breaks in the error message
            marginBottom: '12px'
          }}>
            {error}
          </div>
          {error.includes('Server Error') && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button 
                onClick={handleSubmit}
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
                Retry Submission
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
          )}
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={{ 
          backgroundColor: '#f0fdf4', 
          color: '#15803d', 
          padding: '12px', 
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          Uploading: {uploadProgress}% complete
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: '3' }}>
          <form>
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
                htmlFor="featuredImage"
                style={{ 
                  display: 'block', 
                  fontWeight: '500', 
                  marginBottom: '8px', 
                  fontSize: '16px',
                  color: '#111827'
                }}
              >
                Featured Image <span style={{ color: '#6b7280', fontSize: '12px' }}>(Max 10MB)</span>
              </label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '1px solid #e5e7eb', 
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <label 
                  htmlFor="fileInput"
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#f9fafb',
                    borderRight: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Choose File
                </label>
                <span style={{ padding: '8px 14px', color: '#6b7280', fontSize: '14px' }}>
                  {file ? file.name : 'no file selected'}
                </span>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
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
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                }}
                initialValue=""
                value={content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 300,
                  menubar: true,
                  plugins: [
                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                  ],
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
              />
            </div>
          </form>
        </div>
        
        {/* Right Sidebar */}
        <div style={{ flex: '1' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: '#111827'
            }}>
              Organize
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label 
                htmlFor="category"
                style={{ 
                  display: 'block', 
                  fontWeight: '500', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  color: '#374151',
                  textTransform: 'uppercase'
                }}
              >
                CATEGORY
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  <option value="trending">ट्रेंडिंग | Trending</option>
                  <option value="national">राष्ट्रीय | National</option>
                  <option value="international">अंतरराष्ट्रीय | International</option>
                  <option value="sports">खेल | Sports</option>
                  <option value="entertainment">मनोरंजन | Entertainment</option>
                </select>
                <FiChevronDown 
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#6b7280',
                    pointerEvents: 'none'
                  }} 
                />
              </div>
            </div>
            
            {/* State Dropdown */}
            <div style={{ marginBottom: '16px' }}>
              <label 
                htmlFor="state"
                style={{ 
                  display: 'block', 
                  fontWeight: '500', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  color: '#374151',
                  textTransform: 'uppercase'
                }}
              >
                STATE {journalistProfile?.assignState && '(Pre-assigned)'}
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setDistrict(''); // Reset district when state changes
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    appearance: 'none',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: journalistProfile?.assignState ? '#f9fafb' : 'white',
                    fontSize: '14px'
                  }}
                  disabled={!!journalistProfile?.assignState}
                >
                  <option value="">---------</option>
                  <option value="bihar">बिहार | Bihar</option>
                  <option value="jharkhand">झारखंड | Jharkhand</option>
                  <option value="up">उत्तर प्रदेश | Uttar Pradesh</option>
                </select>
                <FiChevronDown 
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#6b7280',
                    pointerEvents: 'none'
                  }} 
                />
              </div>
            </div>

            {/* District Dropdown */}
            <div style={{ marginBottom: '16px' }}>
              <label 
                htmlFor="district"
                style={{ 
                  display: 'block', 
                  fontWeight: '500', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  color: '#374151',
                  textTransform: 'uppercase'
                }}
              >
                DISTRICT {journalistProfile?.assignDistrict && '(Pre-assigned)'}
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    appearance: 'none',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: journalistProfile?.assignDistrict ? '#f9fafb' : 'white',
                    fontSize: '14px'
                  }}
                  disabled={!state || !!journalistProfile?.assignDistrict}
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
                <FiChevronDown 
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#6b7280',
                    pointerEvents: 'none'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardPost; 