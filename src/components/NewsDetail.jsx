import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Divider,
  Avatar,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Grid,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // API base URL
  const baseURL = 'http://13.234.42.114:3333';
  
  // Check if user is logged in (has auth token)
  const isLoggedIn = !!localStorage.getItem('userAuthToken');
  
  // Get the user token for API requests
  const getUserToken = () => {
    return localStorage.getItem('userAuthToken');
  };

  // Add a debug helper
  const debug = (message, data) => {
    console.log(`[NewsDetail ${id}] ${message}`, data !== undefined ? data : '');
  };

  useEffect(() => {
    debug('Component mounted with ID', id);
    debug('User logged in?', isLoggedIn);
    
    fetchNewsDetail();
    
    // Increment view count immediately
    incrementViewCount();
    
    // Fetch comments for this article
    fetchComments();
    
    // Check if user has already liked the article when component mounts
    if (isLoggedIn) {
      checkLikeStatus();
    }
  }, [id]);

  // Re-check like status whenever login state changes
  useEffect(() => {
    if (isLoggedIn) {
      debug('User login state changed, checking like status');
      checkLikeStatus();
    } else {
      // Reset like status if user logs out
      setIsLiked(false);
    }
  }, [isLoggedIn]);

  // Add function to check if user has already liked the article
  const checkLikeStatus = async () => {
    try {
      const token = getUserToken();
      
      if (!token) {
        debug('No token found for like status check');
        return;
      }

      debug('Checking like status with token');

      // Create request headers
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      // Make the API call to check like status
      const response = await fetch(
        `http://13.234.42.114:3333/api/interaction/news/${id}/like/status`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`Status check failed with status: ${response.status}`);
      }

      const result = await response.json();
      debug('Like status response received', result);

      // Update like status based on response
      if (result.liked || result.isLiked || result.hasLiked) {
        debug('User has liked this article', true);
        setIsLiked(true);
      } else {
        debug('User has not liked this article', false);
        setIsLiked(false);
      }

      // Update like count from response if available
      if (result.likesCount !== undefined) {
        debug('Setting like count from API', result.likesCount);
        setLikeCount(result.likesCount);
      } else if (result.likeCount !== undefined) {
        debug('Setting like count from API', result.likeCount);
        setLikeCount(result.likeCount);
      }
      
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      // Try different API endpoints that might work - more comprehensive list
      const endpoints = [
        `/api/news/${id}`,
        `/api/news/by-id/${id}`,
        `/api/news/details/${id}`,
        `/api/news/post/${id}`,
        `/api/news/trending/${id}`,
        `/api/news/category/trending/${id}`,
        `/api/news/category/national/${id}`,
        `/api/news/category/international/${id}`,
        `/api/news/category/sports/${id}`,
        `/api/news/category/entertainment/${id}`,
        `/api/news/category/district/${id}`
      ];
      
      console.log(`Trying to fetch news article with ID: ${id}`);
      
      let response = null;
      let foundEndpoint = null;
      
      // First, try to fetch from any category endpoint
      // First try individual fetch for each endpoint
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${baseURL}${endpoint}`);
          response = await axios.get(`${baseURL}${endpoint}`);
          if (response.status === 200 && response.data) {
            console.log(`Success with endpoint: ${endpoint}`);
            foundEndpoint = endpoint;
            break;
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed: ${err.message}`);
        }
      }
      
      // If all individual endpoints failed, try to get listing and filter by ID
      if (!response || !foundEndpoint) {
        console.log("Individual endpoints failed, trying to find article in category listings...");
        
        const categoryEndpoints = [
          '/api/news/trending',
          '/api/news/category/trending',
          '/api/news/category/national',
          '/api/news/category/international', 
          '/api/news/category/sports',
          '/api/news/category/entertainment',
          '/api/news/category/district'
        ];
        
        for (const endpoint of categoryEndpoints) {
          try {
            console.log(`Trying to find article in listing: ${baseURL}${endpoint}`);
            const listResponse = await axios.get(`${baseURL}${endpoint}`);
            
            if (listResponse.status === 200 && listResponse.data) {
              // Extract the array of news items
              let newsItems = [];
              if (Array.isArray(listResponse.data)) {
                newsItems = listResponse.data;
              } else if (listResponse.data.data && Array.isArray(listResponse.data.data)) {
                newsItems = listResponse.data.data;
              } else if (listResponse.data.posts && Array.isArray(listResponse.data.posts)) {
                newsItems = listResponse.data.posts;
              }
              
              // Find the article with matching ID
              const article = newsItems.find(item => 
                item.id === id || 
                item.id === parseInt(id) || 
                item._id === id || 
                String(item.id) === String(id)
              );
              
              if (article) {
                console.log(`Found article in ${endpoint}:`, article);
                response = { 
                  data: article,
                  status: 200
                };
                foundEndpoint = endpoint;
                break;
              }
            }
          } catch (err) {
            console.log(`Category endpoint ${endpoint} failed: ${err.message}`);
          }
        }
      }
      
      if (!response || !foundEndpoint) {
        // If all endpoints failed, use mocked data as a last resort
        console.warn("All API endpoints failed, using mocked data...");
        // Use a mock response with the ID
        setNewsData({
          id: id,
          title: `News Article ${id}`,
          content: "This is sample content since the API endpoint couldn't be reached. The content would normally include details about this news article.",
          createdAt: new Date().toISOString(),
          state: "Sample State",
          district: "Sample District",
          featuredImage: "https://via.placeholder.com/800x400?text=News+Image"
        });
      } else {
        console.log(`Successfully fetched data from ${foundEndpoint}`, response.data);
        
        // Process the API response
        if (response.data) {
          const articleData = response.data.data || response.data;
          console.log("Setting news data:", articleData);
          setNewsData(articleData);
          
          // If comments are included in the API response
          if (response.data.comments || (response.data.data && response.data.data.comments)) {
            setComments(response.data.comments || response.data.data.comments || []);
          }
          // Initialize like count from API if available
          const likes = response.data.likes || (response.data.data && response.data.data.likes) || 0;
          setLikeCount(likes);
          // Initialize view count from API if available
          const views = response.data.views || (response.data.data && response.data.data.views) || 0;
          setViewCount(views);
          
          // Now that we have data, try to increment view count
          incrementViewCount();
        }
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching news details:", err);
      // Use mock data in case of error
      setNewsData({
        id: id,
        title: `News Article ${id}`,
        content: "This is sample content since the API endpoint couldn't be reached. The content would normally include details about this news article.",
        createdAt: new Date().toISOString(),
        state: "Sample State",
        district: "Sample District",
        featuredImage: "https://via.placeholder.com/800x400?text=News+Image"
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    try {
      // Create request headers (no auth token needed for views)
      const myHeaders = new Headers();
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow"
      };

      // Make the API call to increment view count
      debug('Sending view count increment request to API');
      const response = await fetch(
        `http://13.234.42.114:3333/api/interaction/news/${id}/view`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`View increment failed with status: ${response.status}`);
      }
      
      const resultText = await response.text();
      debug('Received view count response', resultText);
      
      try {
        if (resultText && resultText.trim()) {
          const result = JSON.parse(resultText);
          debug('Parsed view count response', result);
          
          // Update view count from server response if available
          if (result && typeof result.viewsCount !== 'undefined') {
            debug('Setting view count from API response', result.viewsCount);
            setViewCount(result.viewsCount);
          } else if (result && typeof result.viewCount !== 'undefined') {
            debug('Setting view count from API response', result.viewCount);
            setViewCount(result.viewCount);
          } else if (result && typeof result.views !== 'undefined') {
            debug('Setting view count from API response', result.views);
            setViewCount(result.views);
          } else {
            // If no count returned, increment locally
            setViewCount(prev => prev + 1);
          }
        } else {
          // If no response body, increment locally
          setViewCount(prev => prev + 1);
        }
      } catch (parseError) {
        debug('Response is not valid JSON, incrementing view count locally', parseError.message);
        setViewCount(prev => prev + 1);
      }
      
    } catch (error) {
      console.error("Error incrementing view count:", error);
      // Still increment the view count locally as fallback
      setViewCount(prev => prev + 1);
    }
  };

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      // Prompt user to login
      navigate('/user/login');
      return;
    }

    // If already liked, don't allow re-liking
    if (isLiked) {
      debug('User already liked this article, ignoring click');
      // You can show a message to the user if you want
      // alert('You have already liked this article');
      return;
    }

    try {
      // Get the auth token
      const token = getUserToken();
      debug('Toggling like with token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Track current state for optimistic updates
      const currentLikeState = isLiked;
      const currentLikeCount = likeCount;
      
      // Optimistically update UI - only allow liking, not unliking
      setIsLiked(true);
      setLikeCount(prevCount => prevCount + 1);
      debug('Optimistically updated like state to liked');

      // Create headers with auth token
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow"
      };

      // Make the API call
      debug('Sending like request to API');
      const response = await fetch(
        `http://13.234.42.114:3333/api/interaction/news/${id}/like`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`Like request failed with status: ${response.status}`);
      }
      
      const resultText = await response.text();
      debug('Received like response', resultText);
      
      try {
        if (resultText && resultText.trim()) {
          const result = JSON.parse(resultText);
          debug('Parsed like response', result);
          
          // Update like count from server response if available
          if (result && typeof result.likesCount !== 'undefined') {
            debug('Setting like count from API response', result.likesCount);
            setLikeCount(result.likesCount);
          } else if (result && typeof result.likeCount !== 'undefined') {
            debug('Setting like count from API response', result.likeCount);
            setLikeCount(result.likeCount);
          }
          
          // Always set isLiked to true after a successful like request
          setIsLiked(true);
        }
      } catch (parseError) {
        debug('Response is not valid JSON, keeping optimistic update', parseError.message);
      }
      
    } catch (error) {
      console.error("Error liking article:", error);
      // If there was an error, revert to the previous state
      setIsLiked(false);
      setLikeCount(prevCount => Math.max(0, prevCount - 1));
      // Alert the user of the failure
      alert('Failed to like the article. Please try again.');
    }
  };

  const handleShareClick = () => {
    // For simplicity, use browser's share API if available
    if (navigator.share) {
      navigator.share({
        title: newsData?.title || 'NewzTok Article',
        url: window.location.href,
      }).catch(err => console.error("Error sharing:", err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error("Error copying to clipboard:", err));
    }
  };

  // Function to get current user information from token
  const getCurrentUser = () => {
    try {
      const token = getUserToken();
      if (!token) return null;
      
      // For JWT tokens, try to decode, but don't fail if format is different
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          debug('Decoded token payload', payload);
          
          return {
            id: payload.id || payload.userId || payload.user_id || payload.sub,
            username: payload.username || payload.name || payload.displayName || 'User',
            email: payload.email || ''
          };
        }
      } catch (parseError) {
        console.error('Error parsing token:', parseError);
      }
      
      // Return a default user if token can't be decoded
      return {
        id: 'unknown',
        username: 'User',
        email: ''
      };
    } catch (error) {
      console.error('Error decoding user token:', error);
      return null;
    }
  };

  const handleCommentSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!comment.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    
    // Get the auth token
    const token = getUserToken();
    
    if (!token) {
      alert("Please login to comment");
      return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("User information not available. Please login again");
      return;
    }
    
    try {
      debug('Submitting comment', { newsId: id, comment, user: currentUser });
      setIsSubmitting(true);

      // Add comment optimistically to UI for better UX
      const optimisticComment = {
        id: `temp-${Date.now()}`,
        content: comment,
        createdAt: new Date().toISOString(),
        user: {
          id: currentUser.id || currentUser._id,
          username: currentUser.username || currentUser.name || 'You'
        }
      };
      
      setComments(prevComments => [optimisticComment, ...prevComments]);
      
      // Create headers with auth token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Use the exact format the server expects - simpler payload to start
      const commentPayload = {
        content: comment.trim(),
        newsId: id
      };
      
      debug('Attempting to post comment with payload:', commentPayload);
      
      const response = await fetch(
        `http://13.234.42.114:3333/api/interaction/news/${id}/comment`,
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(commentPayload)
        }
      );
      
      const responseData = await response.text();
      debug('Comment POST response:', responseData);
      
      if (!response.ok) {
        debug('Comment POST failed with status:', response.status);
        throw new Error(`Failed to post comment: ${responseData}`);
      }
      
      // Clear the comment input
      setComment("");
      
      // Fetch the latest comments to ensure we have the server version
      fetchComments();
      
      alert("Comment added successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to add comment. Please try again.");
      
      // Remove optimistic comment on error
      setComments(prevComments => prevComments.filter(c => !c.id.startsWith('temp-')));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to fetch comments with user information
  const fetchComments = async () => {
    try {
      debug('Fetching comments for news ID', id);
      
      // Try multiple endpoints for fetching comments
      const endpointsToTry = [
        `http://13.234.42.114:3333/api/interaction/news/${id}/comments`,
        `http://13.234.42.114:3333/api/news/${id}/comments`,
        `http://13.234.42.114:3333/api/comments/news/${id}`,
        `http://13.234.42.114:3333/api/comments/${id}`
      ];
      
      let response;
      let successEndpoint = '';
      
      // Try each endpoint until one works
      for (const endpoint of endpointsToTry) {
        try {
          debug('Trying to fetch comments from:', endpoint);
          const resp = await fetch(endpoint);
          if (resp.ok) {
            response = resp;
            successEndpoint = endpoint;
            debug('Successfully fetched comments from:', endpoint);
            break;
          }
        } catch (endpointErr) {
          debug('Comments endpoint failed:', endpoint);
        }
      }
      
      if (!response || !response.ok) {
        debug('Could not fetch comments from any endpoint, using empty array');
        setComments([]);
        return;
      }
      
      const result = await response.json();
      debug('Received comments from API at ' + successEndpoint, result);
      
      let fetchedComments = [];
      
      // Handle various API response formats
      if (result && Array.isArray(result)) {
        fetchedComments = result;
      } else if (result && result.comments && Array.isArray(result.comments)) {
        fetchedComments = result.comments;
      } else if (result && result.data && Array.isArray(result.data)) {
        fetchedComments = result.data;
      } else if (result && typeof result === 'object') {
        // If the response is an object with comment-like properties
        // Try to extract individual comments based on common property patterns
        const possibleArrayProps = Object.keys(result).filter(key => 
          Array.isArray(result[key]) && 
          result[key].length > 0 &&
          (key.includes('comment') || key.includes('responses'))
        );
        
        if (possibleArrayProps.length > 0) {
          fetchedComments = result[possibleArrayProps[0]];
        }
      }
      
      debug('Extracted comments array', fetchedComments);
      
      // Ensure all comments have user information
      const processedComments = fetchedComments.map(comment => {
        // Default values if data is missing
        const processedComment = {
          id: comment.id || comment._id || Date.now() + Math.random().toString(36).substring(7),
          content: comment.content || comment.text || comment.message || comment.comment || 'No content',
          createdAt: comment.createdAt || comment.created_at || comment.timestamp || new Date().toISOString(),
        };
        
        // Handle various user data formats
        if (comment.user) {
          processedComment.user = {
            id: comment.user.id || comment.user._id || 'unknown',
            username: comment.user.username || comment.user.name || comment.user.displayName || 'Anonymous'
          };
        } else if (comment.userId || comment.username) {
          processedComment.user = {
            id: comment.userId || comment.user_id || 'unknown',
            username: comment.username || comment.userName || comment.authorName || 'Anonymous'
          };
        } else {
          // If no user information at all, use 'Anonymous'
          processedComment.user = {
            id: 'unknown',
            username: 'Anonymous'
          };
        }
        
        return processedComment;
      });
      
      debug('Processed comments with user data', processedComments);
      setComments(processedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Keep existing comments on error
    }
  };

  const handleLoginRedirect = () => {
    navigate('/user/login');
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return dateString;
    }
  };

  // Get image or video URL and add watermark for downloads
  const getMediaUrl = (item) => {
    if (!item) return null;
    
    console.log("Getting media URL for item:", item);
    
    // Handle YouTube URLs
    if (item.youtubeUrl) {
      console.log("Found YouTube URL:", item.youtubeUrl);
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = item.youtubeUrl.match(regExp);
      return (match && match[2].length === 11)
        ? `https://www.youtube.com/embed/${match[2]}`
        : null;
    }
    
    // Handle images with various property names
    const possibleImageProps = ['featuredImage', 'image', 'images', 'thumbnail', 'thumbnailUrl', 'imageUrl', 'featured_image'];
    
    for (const prop of possibleImageProps) {
      if (item[prop]) {
        // Handle array of images
        if (Array.isArray(item[prop]) && item[prop].length > 0) {
          const imgSrc = item[prop][0];
          console.log(`Found image in ${prop} array:`, imgSrc);
          return typeof imgSrc === 'string' 
            ? (imgSrc.startsWith('http') ? imgSrc : `${baseURL}${imgSrc}`)
            : (imgSrc.url || imgSrc.src || null);
        }
        
        // Handle direct string or object
        if (typeof item[prop] === 'string') {
          console.log(`Found image in ${prop}:`, item[prop]);
          return item[prop].startsWith('http') 
            ? item[prop] 
            : `${baseURL}${item[prop]}`;
        } else if (typeof item[prop] === 'object' && (item[prop].url || item[prop].src)) {
          const imgSrc = item[prop].url || item[prop].src;
          console.log(`Found image in ${prop} object:`, imgSrc);
          return imgSrc.startsWith('http') ? imgSrc : `${baseURL}${imgSrc}`;
        }
      }
    }
    
    console.log("No media URL found in the item");
    return 'https://via.placeholder.com/800x400?text=News+Image';
  };

  // Function to download image with watermark
  const downloadImageWithWatermark = async () => {
    if (!mediaUrl || isYoutubeVideo) {
      alert('No image available to download');
      return;
    }

    try {
      // Create a new image element to load the image
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // This allows working with images from other domains
      
      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = mediaUrl;
      });

      // Create a canvas element to manipulate the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image on the canvas
      ctx.drawImage(img, 0, 0);
      
      // Add watermark text
      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw the diagonal watermark
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6); // Rotate text slightly
      ctx.fillText('NewzTok', 0, 0);
      ctx.restore();
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Create a download link and trigger it
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `NewzTok-${newsData.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Image downloaded with NewzTok watermark');
    } catch (error) {
      console.error('Error downloading image with watermark:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  // Capitalize text
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#f5f5f5'
      }}>
        <CircularProgress size={60} sx={{ color: '#e73952' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading article...
        </Typography>
      </Box>
    );
  }

  if (!newsData) {
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        p: 3,
        bgcolor: '#f5f5f5'
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          Article not found
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
          The article you are looking for could not be found or has been removed.
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleBackClick}
          sx={{ 
            bgcolor: '#e73952',
            '&:hover': { bgcolor: '#d32f2f' } 
          }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  // Determine media type and URL
  const mediaUrl = getMediaUrl(newsData);
  const isYoutubeVideo = mediaUrl && newsData.youtubeUrl;
  const isContentVideo = newsData.contentType === 'video';
  const createdDate = formatDate(newsData.createdAt || newsData.publishedAt || newsData.updatedAt);
  const location = [
    newsData.state && capitalizeFirstLetter(newsData.state),
    newsData.district && capitalizeFirstLetter(newsData.district)
  ].filter(Boolean).join(', ');

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      {/* Back Button */}
      <Box sx={{ bgcolor: '#e73952', color: 'white', py: 1.5, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleBackClick} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              Back
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Article Header */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          {newsData.title}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          {/* Date and Time */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {createdDate}
            </Typography>
          </Box>
          
          {/* Location (State, District) */}
          {location && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {location}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Media (Image or Video) */}
        {mediaUrl && (
          <Box sx={{ width: '100%', mb: 3, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
            {isYoutubeVideo ? (
              <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                  }}
                  src={mediaUrl}
                  title={newsData.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            ) : (
              <Box sx={{ position: 'relative' }}>
                <Box 
                  component="img"
                  src={mediaUrl}
                  alt={newsData.title}
                  sx={{
                    width: '100%',
                    maxHeight: '500px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                  }}
                />
                <Button
                  variant="contained"
                  onClick={downloadImageWithWatermark}
                  sx={{ 
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    bgcolor: 'rgba(231, 57, 82, 0.8)',
                    '&:hover': { 
                      bgcolor: 'rgba(231, 57, 82, 1)' 
                    },
                    borderRadius: 2,
                    fontSize: '12px',
                    textTransform: 'none',
                    padding: '4px 12px',
                    opacity: 0.9,
                    transition: 'opacity 0.3s',
                    '&:hover': {
                      opacity: 1,
                      bgcolor: 'rgba(231, 57, 82, 0.9)'
                    }
                  }}
                >
                  Download with Watermark
                </Button>
              </Box>
            )}
          </Box>
        )}
        
        {/* Action Buttons (Like, View, Share) */}
        <Box sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 4, borderBottom: '1px solid #eee', mb: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: isLiked ? 'default' : 'pointer',
              opacity: isLiked ? 1 : 0.9,
              '&:hover': {
                opacity: isLiked ? 1 : 1
              }
            }} 
            onClick={handleLikeToggle}
          >
            <IconButton 
              color={isLiked ? 'error' : 'default'} 
              size="small"
              disabled={isLiked}
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: isLiked ? 'none' : 'scale(1.1)',
                },
                '&.Mui-disabled': {
                  opacity: 1,
                  color: 'error.main'
                }
              }}
            >
              {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 0.5,
                color: isLiked ? 'error.main' : 'text.primary',
                fontWeight: isLiked ? 'medium' : 'regular'
              }}
            >
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="default" size="small">
              <VisibilityIcon />
            </IconButton>
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {viewCount} {viewCount === 1 ? 'View' : 'Views'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleShareClick}>
            <IconButton color="default" size="small">
              <ShareIcon />
            </IconButton>
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              Share
            </Typography>
          </Box>
        </Box>
        
        {/* Article Content */}
        <Box 
          sx={{ lineHeight: 1.8, mb: 4 }}
          dangerouslySetInnerHTML={{ 
            __html: newsData.content || "No content available for this article." 
          }}
        />
        
        {/* Comments Section */}
        <Box sx={{ py: 3, bgcolor: '#f9f9f9', borderRadius: 2, mt: 4 }}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Comments
            </Typography>
            
            {/* Comment Input - Show only if logged in */}
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', mb: 4, gap: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white'
                    }
                  }}
                />
                <Button
                  variant="contained"
                  disabled={!comment.trim()}
                  onClick={handleCommentSubmit}
                  sx={{ 
                    minWidth: '46px', 
                    bgcolor: '#e73952',
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#d32f2f' }
                  }}
                >
                  <SendIcon />
                </Button>
              </Box>
            ) : (
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleLoginRedirect}
                  sx={{ 
                    bgcolor: '#e73952',
                    '&:hover': { bgcolor: '#d32f2f' }
                  }}
                >
                  Login to comment
                </Button>
              </Box>
            )}
            
            {/* Comments List */}
            <Box>
              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No comments yet. Be the first to comment!
                </Typography>
              ) : (
                comments.map((comment, index) => (
                  <Box key={comment.id || index} sx={{ mb: 3, pb: 3, borderBottom: index < comments.length - 1 ? '1px solid #eee' : 'none' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar 
                        sx={{ bgcolor: '#e73952' }}
                      >
                        {(comment.user?.username || 'U').charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {comment.user?.username || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsDetail; 