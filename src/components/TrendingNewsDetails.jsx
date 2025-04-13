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

const TrendingNewsDetails = () => {
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
    console.log(`[TrendingNewsDetails ${id}] ${message}`, data !== undefined ? data : '');
  };

  useEffect(() => {
    debug('Component mounted with ID', id);
    debug('User logged in?', isLoggedIn);
    
    fetchTrendingNewsDetail();
    
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

  const fetchTrendingNewsDetail = async () => {
    try {
      setLoading(true);
      // Try different API endpoints that might work - more comprehensive list
      const endpoints = [
        `/api/news/trending/${id}`,
        `/api/news/category/trending/${id}`,
        `/api/news/${id}`,
        `/api/news/by-id/${id}`,
        `/api/news/details/${id}`,
        `/api/news/post/${id}`
      ];
      
      console.log(`Trying to fetch trending news article with ID: ${id}`);
      
      let response = null;
      let foundEndpoint = null;
      
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
        console.log("Individual endpoints failed, trying to find article in trending news listing...");
        
        try {
          console.log(`Trying to find article in trending listing: ${baseURL}/api/news/trending`);
          const listResponse = await axios.get(`${baseURL}/api/news/trending`);
          
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
              console.log(`Found article in trending news:`, article);
              response = { 
                data: article,
                status: 200
              };
              foundEndpoint = '/api/news/trending';
            }
          }
        } catch (err) {
          console.log(`Trending endpoint failed: ${err.message}`);
        }
      }
      
      if (!response || !foundEndpoint) {
        // If all endpoints failed, use mocked data as a last resort
        console.warn("All API endpoints failed, using mocked data...");
        // Use a mock response with the ID
        setNewsData({
          id: id,
          title: `Trending News Article ${id}`,
          content: "This is sample content since the API endpoint couldn't be reached. The content would normally include details about this trending news article.",
          createdAt: new Date().toISOString(),
          state: "Sample State",
          district: "Sample District",
          category: "TRENDING",
          featuredImage: "https://via.placeholder.com/800x400?text=Trending+News+Image"
        });
      } else {
        console.log(`Successfully fetched data from ${foundEndpoint}`, response.data);
        
        // Process the API response
        if (response.data) {
          const articleData = response.data.data || response.data;
          console.log("Setting trending news data:", articleData);
          setNewsData(articleData);
          
          // If comments are included in the API response
          if (response.data.comments || (response.data.data && response.data.data.comments)) {
            setComments(response.data.comments || response.data.data.comments || []);
          }
          // Initialize like count from API if available
          const likes = response.data.likesCount || 
            response.data.likes || 
            (response.data.data && response.data.data.likesCount) || 
            (response.data.data && response.data.data.likes) || 
            (response.data.likeCount) || 
            (response.data.data && response.data.data.likeCount) ||
            (response.data.interactions && response.data.interactions.likes) ||
            (response.data.interactions && response.data.interactions.likesCount) ||
            (response.data.data && response.data.data.interactions && response.data.data.interactions.likes) ||
            (response.data.data && response.data.data.interactions && response.data.data.interactions.likesCount) ||
            0;
          setLikeCount(likes);
          // Initialize view count from API if available
          const views = response.data.views || (response.data.data && response.data.data.views) || 0;
          setViewCount(views);
          
          // Now that we have data, try to increment view count
          incrementViewCount(foundEndpoint);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching trending news details:", err);
      // Use mock data in case of error
      setNewsData({
        id: id,
        title: `Trending News Article ${id}`,
        content: "This is sample content since the API endpoint couldn't be reached. The content would normally include details about this trending news article.",
        createdAt: new Date().toISOString(),
        state: "Sample State",
        district: "Sample District",
        category: "TRENDING",
        featuredImage: "https://via.placeholder.com/800x400?text=Trending+News+Image"
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (endpoint) => {
    if (!endpoint) return;
    
    try {
      const myHeaders = new Headers();
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow"
      };
      
      // Use direct URL format
      fetch(`http://13.234.42.114:3333/api/interaction/news/${id}/view`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          // Increment view count locally
          setViewCount(prev => prev + 1);
        })
        .catch((error) => console.error(error));
      
    } catch (err) {
      console.error("Error incrementing view count:", err);
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
        title: newsData?.title || 'Trending NewzTok Article',
        url: window.location.href,
      }).catch(err => console.error("Error sharing:", err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error("Error copying to clipboard:", err));
    }
  };

  const handleLoginRedirect = () => {
    navigate('/user/login');
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
      // Get the auth token
      const token = localStorage.getItem('userAuthToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Configure headers with the token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // In production, this would be a real API call
      // const response = await axios.post(`${baseURL}/api/news/${id}/comment`, { content: comment }, config);
      
      // For now, simulate by adding to local state
      const newComment = {
        id: Date.now(),
        content: comment,
        createdAt: new Date().toISOString(),
        user: {
          username: 'Current User' // This would come from API or state in production
        }
      };
      
      setComments(prev => [newComment, ...prev]);
      setComment('');
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to submit comment. Please try again.");
    }
  };

  const handleBackClick = () => {
    navigate('/trending');
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

  // Get image or video URL
  const getMediaUrl = (item) => {
    if (!item) return null;
    
    console.log("Getting media URL for item:", item);
    
    // Handle YouTube URLs - Get thumbnail instead of embed
    if (item.youtubeUrl) {
      console.log("Found YouTube URL:", item.youtubeUrl);
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = item.youtubeUrl.match(regExp);
      
      // Return YouTube thumbnail instead of embed URL
      return (match && match[2].length === 11)
        ? `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`
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
    return 'https://via.placeholder.com/800x400?text=Trending+News+Image';
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
        <CircularProgress size={60} sx={{ color: '#0039CB' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading trending article...
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
          Trending article not found
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
          The trending article you are looking for could not be found or has been removed.
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleBackClick}
          sx={{ 
            bgcolor: '#0039CB',
            '&:hover': { bgcolor: '#002c9c' } 
          }}
        >
          Back to Trending
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
      {/* Back Button with Trending Theme */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #ff3366, #ff5c33)',
        color: 'white',
        py: 1.5,
        px: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)',
          backgroundSize: '20px 20px',
          opacity: 0.5,
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <IconButton color="inherit" onClick={handleBackClick} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              Back to Trending
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
          {/* Category Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#0039CB',
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {newsData.category || 'TRENDING'}
          </Box>

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
          <Box sx={{ width: '100%', mb: 3, borderRadius: 2, overflow: 'hidden' }}>
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
                e.target.src = 'https://via.placeholder.com/800x400?text=Trending+News+Image';
              }}
            />
            {isYoutubeVideo && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '68px',
                  height: '48px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (newsData.youtubeUrl) {
                    window.open(newsData.youtubeUrl, '_blank');
                  }
                }}
              >
                <svg height="24" width="34" viewBox="0 0 68 48">
                  <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                  <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                </svg>
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
            __html: newsData.content || "No content available for this trending article." 
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
                    bgcolor: '#0039CB',
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#002c9c' }
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
                    bgcolor: '#0039CB',
                    '&:hover': { bgcolor: '#002c9c' }
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
                        sx={{ bgcolor: '#0039CB' }}
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

export default TrendingNewsDetails; 