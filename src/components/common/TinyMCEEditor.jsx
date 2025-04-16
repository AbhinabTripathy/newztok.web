import React, { useRef, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './tinymce-styles.css';

// The API key provided
const TINYMCE_API_KEY = '74ezfl12d3caazs304xdpxge6jtfxivf5ps8xuc8x259fgn4';

// Domains where your application is deployed
const ALLOWED_DOMAINS = [
  'newztok.in',
  'www.newztok.in',
  'api.newztok.in',
  'localhost',
  window.location.hostname // Current domain
];

/**
 * Enhanced TinyMCE Editor component that works with Chrome's cookie policy
 * 
 * @param {object} props - Component props
 * @param {string} props.value - Current content value
 * @param {function} props.onEditorChange - Content change handler
 * @param {object} props.editorRef - Optional ref for the editor instance
 * @param {string} props.initialValue - Initial content
 * @param {object} props.customConfig - Optional custom configuration to merge
 * @param {number} props.height - Editor height (default: 300)
 * @returns {JSX.Element} - TinyMCE Editor component
 */
const TinyMCEEditor = ({ 
  value, 
  onEditorChange,
  editorRef: externalEditorRef, 
  initialValue = "", 
  customConfig = {},
  height = 300
}) => {
  const internalEditorRef = useRef(null);
  const editorRef = externalEditorRef || internalEditorRef;
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [editorError, setEditorError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to show fallback if editor takes too long to initialize
    const timeout = setTimeout(() => {
      if (!editorInitialized) {
        setIsLoading(false);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [editorInitialized]);

  const handleEditorChange = (content, editor) => {
    if (onEditorChange) {
      onEditorChange(content, editor);
    }
  };

  const handleInit = (evt, editor) => {
    // Set the editor reference
    if (editorRef) {
      editorRef.current = editor;
    }
    
    // Mark editor as initialized
    setEditorInitialized(true);
    setIsLoading(false);
    
    // Add any custom init logic here
    try {
      // Handle cookie consent
      const doc = editor.getDoc();
      const win = doc.defaultView || doc.parentWindow;
      
      if (win && typeof win.navigator !== 'undefined' && !win.navigator.cookieEnabled) {
        console.warn('Cookies are disabled in the editor iframe. Some features may not work correctly.');
      }
    } catch (e) {
      console.error('Error during editor initialization:', e);
    }
  };

  const handleEditorError = (error) => {
    console.error('TinyMCE Editor error:', error);
    setEditorError(error.message || 'Failed to load the editor');
    setIsLoading(false);
  };

  const defaultConfig = {
    height,
    menubar: true,
    plugins: [
      'advlist', 'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 
      'image', 'link', 'lists', 'media', 'searchreplace', 'table', 
      'visualblocks', 'wordcount'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    
    // These settings help with Chrome's cookie policy
    referrer_policy: 'origin',
    
    // Set valid domains to avoid cross-domain issues
    document_base_url: window.location.origin,
    
    // Disable browser caching of TinyMCE files
    cache_suffix: `?v=${new Date().getTime()}`,
    
    // Allow CORS-enabled image uploads
    images_upload_credentials: true,
    
    // Add your domains
    allowed_origins: ALLOWED_DOMAINS,
    
    // Use localStorage instead of cookies when possible
    use_localstorage: true,
    
    // Important for cookies in iframes
    iframe_strip_domain: false,
    
    // Use CDN for skin and content CSS instead of local files
    skin: 'oxide',
    content_css: 'default',
    
    // Disable branding
    branding: false,
    
    // Performance optimizations
    entity_encoding: 'raw',
    convert_urls: false,
    
    // Error handling - set the following to true if you're debugging
    remove_script_host: false,
    
    // Initialize directly - don't wait for user interaction
    auto_focus: true,
    
    // Handle script load errors
    setup: function (editor) {
      editor.on('LoadContent', function() {
        // Script executed when content is loaded
      });
    }
  };

  // Merge user config with default config
  const mergedConfig = { ...defaultConfig, ...customConfig };

  // Fallback content in case TinyMCE fails to load
  if (editorError) {
    return (
      <div className="tinymce-container">
        <div className="tinymce-error">
          Failed to load the rich text editor. Please try refreshing the page. Error: {editorError}
        </div>
        <textarea
          value={value || initialValue || ''}
          onChange={(e) => handleEditorChange(e.target.value)}
          className="tinymce-fallback"
          style={{ height: `${height}px` }}
        />
      </div>
    );
  }

  // Show a loading indicator while editor initializes
  if (isLoading && !editorInitialized) {
    return (
      <div className="tinymce-container">
        <div className="tinymce-fallback" style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tinymce-container">
      <Editor
        apiKey={TINYMCE_API_KEY}
        onInit={handleInit}
        initialValue={initialValue}
        value={value}
        onEditorChange={handleEditorChange}
        init={mergedConfig}
        cloudChannel="6" // Use TinyMCE 6
        onError={handleEditorError}
      />
    </div>
  );
};

export default TinyMCEEditor; 