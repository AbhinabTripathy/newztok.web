import React, { useState, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TinyMCEEditor from '../common/TinyMCEEditor';

// API base URL configuration
const API_BASE_URL = 'https://api.newztok.in';

// Configure axios with increased timeout
axios.defaults.timeout = 120000; // 2 minutes timeout

// Special timeout for video uploads (10 minutes)
const VIDEO_UPLOAD_TIMEOUT = 600000; // 10 minutes

const VideoPost = () => {
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMethod, setUploadMethod] = useState('youtube'); // 'youtube' or 'file'
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const handleVideoFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 100MB for video)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size exceeds 100MB. Please select a smaller video file or use YouTube URL instead.');
        return;
      }
      
      setVideoFile(selectedFile);
      // If user uploads a file, switch to file upload method
      setUploadMethod('file');
      // Clear YouTube URL if video file is selected
      setYoutubeUrl('');
    }
  };

  const handleDiscard = () => {
    setTitle('');
    setYoutubeUrl('');
    setVideoFile(null);
    setContent('');
    setCategory('');
    setState('');
    setDistrict('');
    setError('');
    setUploadMethod('youtube');
    if (editorRef.current) {
      editorRef.current.setContent('');
    }
  };

  const handleSaveDraft = () => {
    // Save draft logic here
    console.log('Saving draft...');
  };

  const handleYoutubeUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
    if (e.target.value) {
      // If user enters a YouTube URL, switch to YouTube method
      setUploadMethod('youtube');
      // Clear video file if YouTube URL is entered
      setVideoFile(null);
    }
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
    
    // Validate YouTube URL if that method is chosen
    let isValidYouTubeUrl = false;
    if (uploadMethod === 'youtube') {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      isValidYouTubeUrl = youtubeRegex.test(youtubeUrl);
    }
    
    // Validate form fields
    if (!title || title.trim() === '') {
      setError('Please enter a title for your video post');
      return;
    }
    
    if (uploadMethod === 'youtube' && (!youtubeUrl || !isValidYouTubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    
    if (uploadMethod === 'file' && !videoFile) {
      setError('Please select a video file to upload');
      return;
    }
    
    if (!hasContent || actualContent.trim() === '') {
      setError('Please add a description to your video post');
      return;
    }
    
    if (!category || category.trim() === '') {
      setError('Please select a category for your video post');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Get the auth token
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      // Create FormData to send the post with all data
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', actualContent.trim());
      formData.append('category', category);
      formData.append('contentType', 'video');
      
      // Add different data based on upload method
      if (uploadMethod === 'youtube') {
        formData.append('youtubeUrl', youtubeUrl);
      } else {
        formData.append('videoFile', videoFile);
        formData.append('videoFilePath', videoFile.name);
        console.log('Uploading video file:', videoFile.name, 'Size:', Math.round(videoFile.size/1024/1024) + 'MB');
      }
      
      // Add optional fields only if they exist
      if (state && state.trim() !== '') formData.append('state', state);
      if (district && district.trim() !== '') formData.append('district', district);
      
      // Make the API request with a longer timeout for video uploads
      const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/api/news/create`,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        // Use a much longer timeout for video files
        timeout: uploadMethod === 'file' ? VIDEO_UPLOAD_TIMEOUT : axios.defaults.timeout
      });
      
      console.log('Video post created successfully:', response.data);
      
      // Handle success
      handleDiscard();
      alert('🎉 Success! Your video post has been created and is pending review.');
      navigate('/editor/pending-approval');
      
    } catch (err) {
      console.error('API request failed:', err);
      
      // Special handling for timeout errors
      if (err.code === 'ECONNABORTED') {
        setError('Upload timed out. The video file may be too large. Please try a smaller file or use YouTube URL instead.');
      } else if (err.response && err.response.data) {
        setError(`Error: ${err.response.data.message || err.message}`);
      } else {
        setError(`Error: ${err.message}`);
      }
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
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '5px' }}>Create a Video Post</h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Create and publish video content for the platform</p>
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
            {loading ? 'Publishing...' : 'Publish Video'}
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

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: '3' }}>
          <form>
            {/* Video Title */}
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

            {/* Method Selection */}
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
                Video Source
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setUploadMethod('youtube')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: uploadMethod === 'youtube' ? '#4f46e5' : '#e5e7eb',
                    color: uploadMethod === 'youtube' ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  YouTube URL
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: uploadMethod === 'file' ? '#4f46e5' : '#e5e7eb',
                    color: uploadMethod === 'file' ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Upload Video File
                </button>
              </div>
            </div>

            {/* YouTube URL field - show only if YouTube method is selected */}
            {uploadMethod === 'youtube' && (
              <div style={{ marginBottom: '24px' }}>
                <label 
                  htmlFor="youtubeUrl"
                  style={{ 
                    display: 'block', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    fontSize: '16px',
                    color: '#111827'
                  }}
                >
                  YouTube URL
                </label>
                <input
                  id="youtubeUrl"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={handleYoutubeUrlChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}

            {/* Video File Upload - show only if File method is selected */}
            {uploadMethod === 'file' && (
              <div style={{ marginBottom: '24px' }}>
                <label 
                  htmlFor="videoFile"
                  style={{ 
                    display: 'block', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    fontSize: '16px',
                    color: '#111827'
                  }}
                >
                  Video File <span style={{ color: '#6b7280', fontSize: '12px' }}>(Max 100MB)</span>
                </label>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <label 
                    htmlFor="videoFileInput"
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
                    {videoFile ? videoFile.name : 'no file selected'}
                  </span>
                  <input
                    id="videoFileInput"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            )}

            {/* Video Description */}
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
                Video Description
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

export default VideoPost; 