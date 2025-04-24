import React, { useState, useRef, useEffect } from 'react';
import { FaBold, FaItalic, FaListUl, FaListOl, FaAlignLeft, FaCode } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { BsLightning } from 'react-icons/bs';
import { IoIosUndo, IoIosRedo } from 'react-icons/io';
import { Editor } from '@tinymce/tinymce-react';
import TinyMCEEditor from '../common/TinyMCEEditor';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API URL configuration
const API_BASE_URL = 'https://api.newztok.in';

// Configure axios with increased timeout
axios.defaults.timeout = 120000; // 2 minutes timeout

const StandardPost = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [content, setContent]= useState('');
  const [category, setCategory] = useState(''); 
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB. Please select a smaller image.');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleDiscard = () => {
    alert("We are working on the discard functionality. Please stay tuned!");
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

    // Get the auth token - moved outside try block to make it available in all scopes
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
      setError('No authentication token found. Please login again.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Create FormData to send the post with all data including the image
      const formData = new FormData();
      
      // Add required fields
      formData.append('title', title.trim()); // Post Title/Headline
      formData.append('content', actualContent.trim()); // Content
      formData.append('category', category); // CATEGORY
      formData.append('contentType', 'standard');
      formData.append('featuredImage', file); // Featured Image
      
      // Add optional fields only if they exist
      if (state && state.trim() !== '') formData.append('state', state); // STATE
      if (district && district.trim() !== '') formData.append('district', district); // DISTRICT
      
      // Show the submission data in the console
      console.log('Submitting post with the following data:', {
        title: title.trim(),
        content: `${actualContent.trim().substring(0, 50)}${actualContent.length > 50 ? '...' : ''}`,
        category,
        contentType: 'standard',
        state: state || '[not set]',
        district: district || '[not set]',
        featuredImage: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: file.type
        }
      });
      
      // Try main endpoint
      let response;
      try {
        console.log('Attempting main endpoint: /api/news/create');
        // Make the API request
        response = await axios({
          method: 'post',
          url: `${API_BASE_URL}/api/news/create`,
          data: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        });
      } catch (mainEndpointErr) {
        console.error('Main endpoint failed:', mainEndpointErr);
        
        // Try to extract detailed error information
        let errorDetail = '';
        if (mainEndpointErr.response && mainEndpointErr.response.data) {
          try {
            errorDetail = typeof mainEndpointErr.response.data === 'object' 
              ? JSON.stringify(mainEndpointErr.response.data) 
              : mainEndpointErr.response.data;
            console.log('Server error details:', errorDetail);
          } catch (e) {
            console.error('Could not parse error details');
          }
        }
        
        // Try alternative endpoint #1 - /api/posts
        try {
          console.log('Trying alternative endpoint #1: /api/posts');
          response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/api/posts`,
            data: formData,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        } catch (alt1Err) {
          console.error('Alternative endpoint #1 failed:', alt1Err);
          
          // Try alternative endpoint #2 - /api/content
          try {
            console.log('Trying alternative endpoint #2: /api/content');
            response = await axios({
              method: 'post',
              url: `${API_BASE_URL}/api/content`,
              data: formData,
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            });
          } catch (alt2Err) {
            console.error('Alternative endpoint #2 failed:', alt2Err);
            
            // Last resort - Try alternative endpoint #3 with minimal JSON
            try {
              console.log('Last resort - using /api/v2/news with JSON only');
              
              // Create minimal JSON without problematic fields
              const minimalData = {
                title: title.trim(),
                content: actualContent.trim(),
                category,
                status: 'pending'
              };
              
              response = await axios.post(
                `${API_BASE_URL}/api/v2/news`,
                minimalData,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
            } catch (lastResortErr) {
              console.error('All endpoints failed:', lastResortErr);
              // Let the main error handler deal with this
              throw {
                message: 'Server unavailable: All API endpoints failed',
                originalErrors: {
                  main: mainEndpointErr?.message,
                  alt1: alt1Err?.message,
                  alt2: alt2Err?.message,
                  lastResort: lastResortErr?.message
                },
                serverDetail: errorDetail
              };
            }
          }
        }
      }
      
      console.log('Post created successfully:', response.data);
      
      // Handle success
      setLoading(false);
      setError('');
      
      // Show success message
      setSuccess(
        <div>
          <div style={{fontWeight: 'bold', fontSize: '16px', marginBottom: '6px'}}>
            🎉 Success! Your post has been submitted for review.
          </div>
          <div style={{marginBottom: '4px'}}>
            Title: <strong>{title}</strong>
          </div>
          <div style={{marginBottom: '4px'}}>
            Category: <strong>{category}</strong>
            {state ? <span>, State: <strong>{state}</strong></span> : ''}
            {district ? <span>, District: <strong>{district}</strong></span> : ''}
          </div>
        </div>
      );
      
      // Clear form
      handleDiscard();
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/editor/pending-approval');
      }, 2000);
      
    } catch (err) {
      console.error('API request failed:', err);
      
      // Enhanced error reporting with more details
      if (err.originalErrors) {
        const errorDetails = Object.entries(err.originalErrors)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ');
        
        setError(`All API endpoints failed. Please contact the admin with this error: ${err.message}. 
          Try again later or use another browser. 
          Server details: ${err.serverDetail || 'Unknown'}`);
      } else if (err.response && err.response.data) {
        // Try to extract message from various response formats
        let message = err.message;
        try {
          if (typeof err.response.data === 'object' && err.response.data.message) {
            message = err.response.data.message;
          } else if (typeof err.response.data === 'string') {
            const match = err.response.data.match(/"message"\s*:\s*"([^"]+)"/);
            if (match && match[1]) {
              message = match[1];
            }
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        
        setError(`Server error: ${message}. Status: ${err.response.status}`);
      } else {
        setError(`Error: ${err.message}`);
      }
      
      // Display a more user-friendly error 
      setError(<div>
        <div style={{fontWeight: 'bold', marginBottom: '8px'}}>Unable to create post</div>
        <div>The server is currently experiencing issues. This appears to be a server-side database problem.</div>
        <div style={{marginTop: '8px'}}>
          <strong>Please try:</strong>
          <ul style={{marginLeft: '20px', marginTop: '4px'}}>
            <li>Using the "Save Draft" option instead</li>
            <li>Contact your technical support team</li>
            <li>Try again in a few hours after the database issues are resolved</li>
          </ul>
        </div>
        <div style={{marginTop: '8px', fontSize: '13px', color: '#666'}}>
          Technical details: {err.message || 'Unknown error'}
        </div>
      </div>);
    } finally {
      setLoading(false);
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
          padding: '12px', 
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          backgroundColor: '#ecfdf5', 
          color: '#065f46', 
          padding: '12px', 
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {success}
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
                Featured Image <span style={{ color: '#6b7280', fontSize: '12px' }}>(Max 50MB)</span>
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
              <TinyMCEEditor
                editorRef={editorRef}
                value={content}
                onEditorChange={handleEditorChange}
                height={300}
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
                STATE
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
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
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
                DISTRICT
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
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                  disabled={!state}
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