import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Divider,
  CircularProgress,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { useStateContext } from './Header'; // Import state context
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const HomeScreen = () => {
  // State variables for each news section
  const [trendingNews, setTrendingNews] = useState([]);
  const [nationalNews, setNationalNews] = useState([]);
  const [internationalNews, setInternationalNews] = useState([]);
  const [sportsNews, setSportsNews] = useState([]);
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [stateNews, setStateNews] = useState([]);
  const { selectedState } = useStateContext(); // Get selected state from context
  
  // Fallback image for errors
  const fallbackImage = "https://via.placeholder.com/400x300?text=Image+Not+Available";
  
  // Loading and error states for each section
  const [loading, setLoading] = useState({
    trending: true,
    national: true,
    international: true,
    sports: true,
    entertainment: true,
    state: true
  });
  
  const [error, setError] = useState({
    trending: null,
    national: null,
    international: null,
    sports: null,
    entertainment: null,
    state: null
  });

  // // Social media stats exactly as in the image
  // const socialMedia = [
  //   { icon: <FacebookIcon sx={{ fontSize: 28, color: '#4267B2' }} />, count: '20.5k', label: 'likes' },
  //   { icon: <InstagramIcon sx={{ fontSize: 28, color: '#C13584' }} />, count: '20.5k', label: 'followers' },
  //   { icon: <TwitterIcon sx={{ fontSize: 28, color: '#1DA1F2' }} />, count: '20.5k', label: 'followers' },
  //   { icon: <YouTubeIcon sx={{ fontSize: 28, color: '#FF0000' }} />, count: '20.5k', label: 'subscribers' },
  // ];

  // // Category tabs data
  // const categoryTabs = [
  //   { name: 'Active', count: '11' },
  //   { name: 'Business', count: '10' },
  //   { name: 'Crazy', count: '5' },
  // ];

  // Base URL for API
  const baseUrl = 'https://api.newztok.in';

  // Format date function
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

  // Helper function to capitalize first letter of each word
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Function to process API response and identify videos
  const processApiResponseWithVideos = (response, category) => {
    let news = [];
    
    if (response.data && Array.isArray(response.data)) {
      news = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      news = response.data.data;
    } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
      news = response.data.posts;
    }
    
    // Process each news item to handle videos - exact implementation from TrendingNews.jsx
    news = news.map(item => {
      // Check all possible properties for video paths
      const checkForVideoPath = (obj) => {
        // Define properties to check for video paths
        const propertiesToCheck = [
          'video', 'videoPath', 'featuredImage', 'image', 'media', 'url', 'source'
        ];
        
        let foundVideoPath = null;
        
        // Check each property for a video path
        propertiesToCheck.forEach(prop => {
          if (obj[prop] && typeof obj[prop] === 'string' && obj[prop].includes('/uploads/videos/video-')) {
            foundVideoPath = obj[prop];
            console.log(`Found video path in ${prop} property: ${foundVideoPath}`);
          }
        });
        
        // Also check if there's a directly assigned videoPath property
        if (obj.videoPath && typeof obj.videoPath === 'string') {
          foundVideoPath = obj.videoPath;
          console.log(`Found direct videoPath property: ${foundVideoPath}`);
        }
        
        return foundVideoPath;
      };
      
      // Get video path from the item
      const videoPath = checkForVideoPath(item);
      
      if (videoPath) {
        console.log(`Found video for news item "${item.title}": ${videoPath}`);
        
        // Ensure video URL has the base URL if it's a relative path
        const fullVideoUrl = videoPath.startsWith('http') 
          ? videoPath 
          : `${baseUrl}${videoPath}`;
        
        console.log(`Full video URL for "${item.title}": ${fullVideoUrl}`);
        
        return {
          ...item,
          video: fullVideoUrl,
          hasVideo: true
        };
      }
      
      return item;
    });
    
    // Filter news by selected state if one is selected
    if (selectedState) {
      console.log(`Filtering ${category} news by state: ${selectedState}`);
      
      // First, try to match exact state name
      let filteredNews = news.filter(item => 
        item.state && (item.state.includes(selectedState) || selectedState.includes(item.state))
      );
      
      // If no exact matches, check if state is mentioned in the content or title
      if (filteredNews.length === 0) {
        filteredNews = news.filter(item => 
          (item.content && item.content.includes(selectedState)) || 
          (item.title && item.title.includes(selectedState))
        );
      }
      
      // If we found filtered results, use them; otherwise, fall back to all news
      if (filteredNews.length > 0) {
        console.log(`Found ${filteredNews.length} ${category} news items for state: ${selectedState}`);
        news = filteredNews;
      } else {
        console.log(`No ${category} news items found for state: ${selectedState}, showing all ${category} news`);
      }
    }
    
    // Limit to 5 posts per section
    return news.slice(0, 5);
  };

  // Fetch trending news
  const fetchTrendingNews = async () => {
    setLoading(prev => ({ ...prev, trending: true }));
    setError(prev => ({ ...prev, trending: null }));
    
    try {
      console.log('Fetching trending news...');
      const response = await axios.get(`${baseUrl}/api/news/featured`);
      
      let news = [];
      if (response.data && Array.isArray(response.data)) {
        news = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        news = response.data.data;
      } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
        news = response.data.posts;
      }
      
      // Process each news item to handle videos - exactly like TrendingNews.jsx
      news = news.map(item => {
        // Check all possible properties for video paths
        const checkForVideoPath = (obj) => {
          // Define properties to check for video paths
          const propertiesToCheck = [
            'video', 'videoPath', 'featuredImage', 'image', 'media', 'url', 'source'
          ];
          
          let foundVideoPath = null;
          
          // Check each property for a video path
          propertiesToCheck.forEach(prop => {
            if (obj[prop] && typeof obj[prop] === 'string' && obj[prop].includes('/uploads/videos/video-')) {
              foundVideoPath = obj[prop];
              console.log(`Found video path in ${prop} property: ${foundVideoPath}`);
            }
          });
          
          // Also check if there's a directly assigned videoPath property
          if (obj.videoPath && typeof obj.videoPath === 'string') {
            foundVideoPath = obj.videoPath;
            console.log(`Found direct videoPath property: ${foundVideoPath}`);
          }
          
          return foundVideoPath;
        };
        
        // Get video path from the item
        const videoPath = checkForVideoPath(item);
        
        if (videoPath) {
          console.log(`Found video for news item "${item.title}": ${videoPath}`);
          
          // Ensure video URL has the base URL if it's a relative path
          const fullVideoUrl = videoPath.startsWith('http') 
            ? videoPath 
            : `${baseUrl}${videoPath}`;
          
          console.log(`Full video URL for "${item.title}": ${fullVideoUrl}`);
          
          return {
            ...item,
            video: fullVideoUrl,
            hasVideo: true
          };
        }
        
        return item;
      });
      
      // Filter news by selected state if one is selected
      if (selectedState) {
        console.log(`Filtering trending news by state: ${selectedState}`);
        
        // First, try to match exact state name
        let filteredNews = news.filter(item => 
          item.state && (item.state.includes(selectedState) || selectedState.includes(item.state))
        );
        
        // If no exact matches, check if state is mentioned in the content or title
        if (filteredNews.length === 0) {
          filteredNews = news.filter(item => 
            (item.content && item.content.includes(selectedState)) || 
            (item.title && item.title.includes(selectedState))
          );
        }
        
        // If we found filtered results, use them; otherwise, fall back to all news
        if (filteredNews.length > 0) {
          console.log(`Found ${filteredNews.length} trending news items for state: ${selectedState}`);
          news = filteredNews;
        } else {
          console.log(`No trending news items found for state: ${selectedState}, showing all trending news`);
        }
      }
      
      console.log('Trending news:', news);
      setTrendingNews(news);
    } catch (err) {
      console.error('Error fetching trending news:', err);
      setError(prev => ({ 
        ...prev, 
        trending: err.response?.data?.message || err.message || 'Failed to fetch trending news' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, trending: false }));
    }
  };

  // Fetch national news
  const fetchNationalNews = async () => {
    setLoading(prev => ({ ...prev, national: true }));
    setError(prev => ({ ...prev, national: null }));
    
    try {
      console.log('Fetching national news...');
      const response = await axios.get(`${baseUrl}/api/news/category/national`);
      
      let news = [];
      if (response.data && Array.isArray(response.data)) {
        news = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        news = response.data.data;
      } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
        news = response.data.posts;
      }
      
      // Process each news item to handle videos - exactly like TrendingNews.jsx
      news = news.map(item => {
        // Check all possible properties for video paths
        const checkForVideoPath = (obj) => {
          // Define properties to check for video paths
          const propertiesToCheck = [
            'video', 'videoPath', 'featuredImage', 'image', 'media', 'url', 'source'
          ];
          
          let foundVideoPath = null;
          
          // Check each property for a video path
          propertiesToCheck.forEach(prop => {
            if (obj[prop] && typeof obj[prop] === 'string' && obj[prop].includes('/uploads/videos/video-')) {
              foundVideoPath = obj[prop];
              console.log(`Found video path in ${prop} property: ${foundVideoPath}`);
            }
          });
          
          // Also check if there's a directly assigned videoPath property
          if (obj.videoPath && typeof obj.videoPath === 'string') {
            foundVideoPath = obj.videoPath;
            console.log(`Found direct videoPath property: ${foundVideoPath}`);
          }
          
          return foundVideoPath;
        };
        
        // Get video path from the item
        const videoPath = checkForVideoPath(item);
        
        if (videoPath) {
          console.log(`Found video for news item "${item.title}": ${videoPath}`);
          
          // Ensure video URL has the base URL if it's a relative path
          const fullVideoUrl = videoPath.startsWith('http') 
            ? videoPath 
            : `${baseUrl}${videoPath}`;
          
          console.log(`Full video URL for "${item.title}": ${fullVideoUrl}`);
          
          return {
            ...item,
            video: fullVideoUrl,
            hasVideo: true
          };
        }
        
        return item;
      });
      
      // Filter news by selected state if one is selected
      if (selectedState) {
        console.log(`Filtering national news by state: ${selectedState}`);
        
        // First, try to match exact state name
        let filteredNews = news.filter(item => 
          item.state && (item.state.includes(selectedState) || selectedState.includes(item.state))
        );
        
        // If no exact matches, check if state is mentioned in the content or title
        if (filteredNews.length === 0) {
          filteredNews = news.filter(item => 
            (item.content && item.content.includes(selectedState)) || 
            (item.title && item.title.includes(selectedState))
          );
        }
        
        // If we found filtered results, use them; otherwise, fall back to all news
        if (filteredNews.length > 0) {
          console.log(`Found ${filteredNews.length} national news items for state: ${selectedState}`);
          news = filteredNews;
        } else {
          console.log(`No national news items found for state: ${selectedState}, showing all national news`);
        }
      }
      
      console.log('National news:', news);
      setNationalNews(news);
    } catch (err) {
      console.error('Error fetching national news:', err);
      setError(prev => ({ 
        ...prev, 
        national: err.response?.data?.message || err.message || 'Failed to fetch national news' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, national: false }));
    }
  };

  // Fetch international news
  const fetchInternationalNews = async () => {
    setLoading(prev => ({ ...prev, international: true }));
    setError(prev => ({ ...prev, international: null }));
    
    try {
      console.log('Fetching international news...');
      const response = await axios.get(`${baseUrl}/api/news/category/international`);
      const news = processApiResponseWithVideos(response, 'international');
      console.log('International news:', news);
      setInternationalNews(news);
    } catch (err) {
      console.error('Error fetching international news:', err);
      setError(prev => ({ 
        ...prev, 
        international: err.response?.data?.message || err.message || 'Failed to fetch international news' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, international: false }));
    }
  };

  // Fetch sports news
  const fetchSportsNews = async () => {
    setLoading(prev => ({ ...prev, sports: true }));
    setError(prev => ({ ...prev, sports: null }));
    
    try {
      console.log('Fetching sports news...');
      const response = await axios.get(`${baseUrl}/api/news/category/sports`);
      const news = processApiResponseWithVideos(response, 'sports');
      console.log('Sports news:', news);
      setSportsNews(news);
    } catch (err) {
      console.error('Error fetching sports news:', err);
      setError(prev => ({ 
        ...prev, 
        sports: err.response?.data?.message || err.message || 'Failed to fetch sports news' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, sports: false }));
    }
  };

  // Fetch entertainment news
  const fetchEntertainmentNews = async () => {
    setLoading(prev => ({ ...prev, entertainment: true }));
    setError(prev => ({ ...prev, entertainment: null }));
    
    try {
      console.log('Fetching entertainment news...');
      const response = await axios.get(`${baseUrl}/api/news/category/entertainment`);
      const news = processApiResponseWithVideos(response, 'entertainment');
      console.log('Entertainment news:', news);
      setEntertainmentNews(news);
    } catch (err) {
      console.error('Error fetching entertainment news:', err);
      setError(prev => ({ 
        ...prev, 
        entertainment: err.response?.data?.message || err.message || 'Failed to fetch entertainment news' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, entertainment: false }));
    }
  };

  // Fetch state news
  const fetchStateNews = async () => {
    try {
      setLoading(prev => ({ ...prev, state: true }));
      setError(prev => ({ ...prev, state: null }));

      // Fetch news from all three states
      const [biharNews, jharkhandNews, upNews] = await Promise.all([
        axios.get('https://api.newztok.in/api/news/state/bihar'),
        axios.get('https://api.newztok.in/api/news/state/jharkhand'),
        axios.get('https://api.newztok.in/api/news/state/up')
      ]);

      // Combine and sort all news by date
      const allStateNews = [
        ...(biharNews.data.data || []),
        ...(jharkhandNews.data.data || []),
        ...(upNews.data.data || [])
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Process each news item to check for videos
      const processedStateNews = allStateNews.map(item => {
        const hasVideo = 
          item.hasVideo || 
          item.video || 
          item.videoPath || 
          (item.featuredImage && typeof item.featuredImage === 'string' && item.featuredImage.includes('/uploads/videos/video-')) ||
          (item.image && typeof item.image === 'string' && item.image.includes('/uploads/videos/video-'));

        console.log(`[state] Item "${item.title || 'Unknown'}" has video: ${hasVideo}`);
        
        return {
          ...item,
          hasVideo
        };
      });

      // Take the most recent 2 news items
      setStateNews(processedStateNews.slice(0, 2));
    } catch (err) {
      console.error('Error fetching state news:', err);
      setError(prev => ({ ...prev, state: 'Failed to load state news' }));
    } finally {
      setLoading(prev => ({ ...prev, state: false }));
    }
  };

  // Fetch all news on component mount and when selectedState changes
  useEffect(() => {
    fetchTrendingNews();
    fetchNationalNews();
    fetchInternationalNews();
    fetchSportsNews();
    fetchEntertainmentNews();
    fetchStateNews();
  }, [selectedState]); // Re-fetch when selected state changes

  // News card component (single card with specific styling)
  const NewsCard = ({ item, categoryLabel, categoryColor = '#FF5722', isLarge = false }) => {
    const [imageError, setImageError] = useState(false);
    
    if (!item) return null;
    
    const handleImageError = () => {
      console.error(`Error loading image for "${item.title}"`);
      setImageError(true);
    };
    
    // Get actual category
    const category = categoryLabel || capitalizeFirstLetter(item.category) || "NEWS";
    
    // Check if item has video - exactly like TrendingNews.jsx
    const hasVideo = item.hasVideo || item.video || item.videoPath ||
      (item.featuredImage && item.featuredImage.includes('/uploads/videos/video-')) ||
      (item.image && item.image.includes('/uploads/videos/video-'));
    
    // Get image URL with proper handling - exactly like TrendingNews.jsx
    const getImageUrl = () => {
      console.log(`Getting image URL for item with title "${item.title || 'Unknown'}":`, {
        id: item._id || item.id,
        featuredImage: item.featuredImage,
        image: item.image,
        images: item.images,
        youtubeUrl: item.youtubeUrl
      });
      
      // If item has YouTube URL, use YouTube thumbnail
      if (item.youtubeUrl) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = item.youtubeUrl.match(regExp);
        if (match && match[2].length === 11) {
          const videoId = match[2];
          console.log(`Using YouTube thumbnail for "${item.title}": ${videoId}`);
          return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
      
      // If item has images array with content
      if (item.images && item.images.length > 0) {
        console.log(`Using images[0] from array for "${item.title}": ${item.images[0]}`);
        return item.images[0];
      }
      
      // If item has featuredImage
      if (item.featuredImage) {
        // Check if it's a full URL or just a path
        if (item.featuredImage.startsWith('http')) {
          console.log(`Using full featuredImage URL for "${item.title}": ${item.featuredImage}`);
          return item.featuredImage;
        } else {
          // Add base URL for relative paths
          const fullUrl = `${baseUrl}${item.featuredImage}`;
          console.log(`Using relative featuredImage with base URL for "${item.title}": ${fullUrl}`);
          return fullUrl;
        }
      }
      
      // If item has image property
      if (item.image) {
        // Check if it's a full URL or just a path
        if (item.image.startsWith('http')) {
          console.log(`Using full image URL for "${item.title}": ${item.image}`);
          return item.image;
        } else {
          // Add base URL for relative paths
          const fullUrl = `${baseUrl}${item.image}`;
          console.log(`Using relative image with base URL for "${item.title}": ${fullUrl}`);
          return fullUrl;
        }
      }
      
      // Fallback to placeholder
      console.log(`No image found for "${item.title}", using placeholder`);
      return 'https://via.placeholder.com/400x300?text=No+Image';
    };
    
    // Get video URL if present - exactly like TrendingNews.jsx
    const getVideoUrl = () => {
      // First, check if video property is already set (from our processing)
      if (item.video) {
        return item.video;
      }
      
      // Next, check for videoPath property
      if (item.videoPath) {
        return item.videoPath.startsWith('http') 
          ? item.videoPath 
          : `${baseUrl}${item.videoPath}`;
      }
      
      // Check other fields for video paths
      if (item.featuredImage && item.featuredImage.includes('/uploads/videos/video-')) {
        return item.featuredImage.startsWith('http') 
          ? item.featuredImage 
          : `${baseUrl}${item.featuredImage}`;
      }
      
      if (item.image && item.image.includes('/uploads/videos/video-')) {
        return item.image.startsWith('http') 
          ? item.image 
          : `${baseUrl}${item.image}`;
      }
      
      return null;
    };
    
    const videoUrl = hasVideo ? getVideoUrl() : null;
    const imageUrl = !hasVideo ? getImageUrl() : null;
    
    // Check if it's a YouTube video
    const isYouTubeVideo = !!item.youtubeUrl;
    
    console.log(`Rendering NewsCard for "${item.title || 'Unknown'}" - hasVideo: ${hasVideo}, videoUrl: ${videoUrl}`);
    
    const title = item.title || "No Title";
    const time = formatDate(item.createdAt || item.publishedAt || item.updatedAt);
    
    return (
      <Box
        component={Link}
        to={`/news/${item.id || item._id}`}
        sx={{
          display: 'block',
          height: isLarge ? { xs: 350, md: 400 } : { xs: 200, md: 240 },
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
          textDecoration: 'none',
          '&:hover': {
            '& .news-bg': {
              transform: 'scale(1.05)',
              transition: 'transform 0.5s ease'
            }
          }
        }}
      >
        {/* Show video for video items, image for others - exactly like TrendingNews.jsx */}
        {hasVideo ? (
          <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
            <Box
              component="video"
              src={videoUrl}
              controls
              preload="metadata"
              controlsList="nodownload"
              onClick={(e) => e.stopPropagation()}
              playsInline
              muted
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                console.error('Video failed to load:', videoUrl);
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </Box>
        ) : !imageError ? (
          <Box
            className="news-bg"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'transform 0.3s ease',
            }}
            onError={handleImageError}
          />
        ) : (
          <Box
            className="news-bg"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              color: '#999',
              transition: 'transform 0.3s ease',
            }}
          >
            Image not available
          </Box>
        )}
        
        {/* YouTube play button overlay for videos */}
        {isYouTubeVideo && !hasVideo && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isLarge ? '70px' : '60px',
              height: isLarge ? '70px' : '60px',
              backgroundColor: 'rgba(255, 0, 0, 0.8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </Box>
        )}
        
        {/* Dark overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1,
          }}
        />
        
        {/* Category label */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
            backgroundColor: hasVideo ? '#E53E3E' : categoryColor,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            padding: '6px 16px',
            borderRadius: '4px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {hasVideo && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          {category}
          {hasVideo && " VIDEO"}
        </Box>
        
        {/* News content */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.9))',
            zIndex: 2,
          }}
        >
          <Typography
            variant={isLarge ? "h5" : "h6"}
            sx={{
              color: 'white',
              fontWeight: '600',
              mb: 2,
              lineHeight: 1.3,
              fontSize: isLarge ? '1.3rem' : '1rem',
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon 
                sx={{ 
                  fontSize: '16px', 
                  mr: 1, 
                  color: 'rgba(255,255,255,0.8)' 
                }} 
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.8rem',
                }}
              >
                {time}
              </Typography>
            </Box>
            
            {/* Show state and district if available */}
            {(item.state || item.district) && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LocationOnIcon 
                  sx={{ 
                    fontSize: '16px', 
                    mr: 1, 
                    color: 'rgba(255,255,255,0.8)' 
                  }} 
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.8rem',
                  }}
                >
                  {[item.state, item.district].filter(Boolean).map(capitalizeFirstLetter).join(', ')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  // Secondary news card component (for the second section)
  const SecondSectionNewsCard = ({ item, categoryLabel, categoryColor = '#FF5722' }) => {
    const [imageError, setImageError] = useState(false);
    
    if (!item) return null;

    const handleImageError = () => {
      console.error(`Error loading image for "${item.title}"`);
      setImageError(true);
    };

    // Get actual category
    const category = categoryLabel || capitalizeFirstLetter(item.category) || "NEWS";
    
    // Check if item has video - exactly like TrendingNews.jsx
    const hasVideo = item.hasVideo || item.video || item.videoPath ||
      (item.featuredImage && item.featuredImage.includes('/uploads/videos/video-')) ||
      (item.image && item.image.includes('/uploads/videos/video-'));
    
    // Get image URL with proper handling - exactly like TrendingNews.jsx
    const getImageUrl = () => {
      // If item has YouTube URL, use YouTube thumbnail
      if (item.youtubeUrl) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = item.youtubeUrl.match(regExp);
        if (match && match[2].length === 11) {
          const videoId = match[2];
          return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
      
      // If item has images array with content
      if (item.images && item.images.length > 0) {
        return item.images[0];
      }
      
      // If item has featuredImage
      if (item.featuredImage) {
        // Check if it's a full URL or just a path
        if (item.featuredImage.startsWith('http')) {
          return item.featuredImage;
        } else {
          // Add base URL for relative paths
          return `${baseUrl}${item.featuredImage}`;
        }
      }
      
      // If item has image property
      if (item.image) {
        // Check if it's a full URL or just a path
        if (item.image.startsWith('http')) {
          return item.image;
        } else {
          // Add base URL for relative paths
          return `${baseUrl}${item.image}`;
        }
      }
      
      // Fallback to placeholder
      return 'https://via.placeholder.com/400x300?text=No+Image';
    };
    
    // Get video URL if present - exactly like TrendingNews.jsx
    const getVideoUrl = () => {
      // First, check if video property is already set (from our processing)
      if (item.video) {
        return item.video;
      }
      
      // Next, check for videoPath property
      if (item.videoPath) {
        return item.videoPath.startsWith('http') 
          ? item.videoPath 
          : `${baseUrl}${item.videoPath}`;
      }
      
      // Check other fields for video paths
      if (item.featuredImage && item.featuredImage.includes('/uploads/videos/video-')) {
        return item.featuredImage.startsWith('http') 
          ? item.featuredImage 
          : `${baseUrl}${item.featuredImage}`;
      }
      
      if (item.image && item.image.includes('/uploads/videos/video-')) {
        return item.image.startsWith('http') 
          ? item.image 
          : `${baseUrl}${item.image}`;
      }
      
      return null;
    };
    
    const videoUrl = hasVideo ? getVideoUrl() : null;
    const imageUrl = !hasVideo ? getImageUrl() : null;
    
    // Check if it's a YouTube video
    const isYouTubeVideo = !!item.youtubeUrl;

    console.log(`Rendering SecondSectionNewsCard for "${item.title || 'Unknown'}" - hasVideo: ${hasVideo}, videoUrl: ${videoUrl}`);

    return (
      <Card 
        component={Link} 
        to={`/news/${item.id || item._id}`}
        sx={{
          cursor: 'pointer',
          width: '100%',
          position: 'relative',
          boxShadow: 'none',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'transform 0.3s ease',
          textDecoration: 'none',
          '&:hover': {
            transform: 'translateY(-3px)',
            '& .news-card-img': {
              transform: 'scale(1.05)',
            }
          },
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box sx={{ 
          position: 'relative', 
          overflow: 'hidden', 
          paddingTop: '56.25%', // 16:9 aspect ratio
          backgroundColor: '#f0f0f0'
        }}>
          {hasVideo ? (
            <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
              <Box
                component="video"
                src={videoUrl}
                controls
                preload="metadata"
                controlsList="nodownload"
                onClick={(e) => e.stopPropagation()}
                playsInline
                muted
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  console.error('Video failed to load:', videoUrl);
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          ) : !imageError ? (
            <CardMedia
              className="news-card-img"
              component="img"
              image={imageUrl}
              alt={item.title || "News image"}
              onError={handleImageError}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                color: '#999'
              }}
            >
              Image not available
            </Box>
          )}
          
          {/* YouTube play button overlay for videos */}
          {isYouTubeVideo && !hasVideo && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </Box>
          )}
          
          {/* Category badge */}
          <Box 
            sx={{ 
              position: 'absolute',
              top: 10,
              left: 10,
              bgcolor: hasVideo ? '#E53E3E' : categoryColor,
              color: 'white',
              py: 0.5,
              px: 1.5,
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {hasVideo && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            {category}
            {hasVideo && " VIDEO"}
          </Box>
        </Box>
      </Card>
    );
  };

  // Loading section component
  const LoadingSection = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
      <CircularProgress />
    </Box>
  );

  // Error section component
  const ErrorSection = ({ message }) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, color: 'error.main' }}>
      <Typography variant="body1">{message}</Typography>
    </Box>
  );

  // // Category tab component
  // const CategoryTab = ({ name, count }) => (
  //   <Box 
  //     sx={{ 
  //       display: 'flex', 
  //       justifyContent: 'space-between', 
  //       alignItems: 'center',
  //       backgroundColor: '#000',
  //       color: 'white',
  //       p: 2,
  //       borderRadius: 2,
  //       mb: 2,
  //       cursor: 'pointer',
  //       '&:hover': {
  //         opacity: 0.9
  //       }
  //     }}
  //   >
  //     <Typography fontWeight="medium">{name}</Typography>
  //     <Box 
  //       sx={{ 
  //         backgroundColor: 'white', 
  //         color: 'black', 
  //         width: 30, 
  //         height: 30, 
  //         borderRadius: '50%',
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         fontWeight: 'bold',
  //         fontSize: '0.9rem'
  //       }}
  //     >
  //       {count}
  //     </Box>
  //   </Box>
  // );

  // 970 x 100 Advertisement component
  const LargeAd = () => {
    const [bannerAd, setBannerAd] = useState(null);
    const [bannerError, setBannerError] = useState(null);
    const [bannerLoading, setBannerLoading] = useState(true);

    useEffect(() => {
      const fetchBannerAd = async () => {
        try {
          setBannerLoading(true);
          setBannerError(null);
          console.log('Fetching banner ad from API...');
          
          const response = await axios.get(`${baseUrl}/api/ads/public/web/banner`);
          console.log('Banner ad API response:', response.data);
          
          if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            // Take the first ad from the array
            const ad = response.data.data[0];
            // Log the redirect URL for debugging
            console.log('Banner ad redirect URL:', ad.redirectUrl);
            setBannerAd(ad);
          } else if (response.data && !Array.isArray(response.data)) {
            setBannerAd(response.data);
          } else {
            setBannerError('No ads available');
          }
        } catch (err) {
          console.error('Error fetching banner ad:', err);
          setBannerError(err.message || 'Failed to load advertisement');
        } finally {
          setBannerLoading(false);
        }
      };

      fetchBannerAd();
    }, []);

    // Handle ad click
    const handleAdClick = (e) => {
      e.preventDefault();
      if (bannerAd && bannerAd.redirectUrl) {
        console.log('Redirecting to banner ad URL:', bannerAd.redirectUrl);
        window.open(bannerAd.redirectUrl, '_blank', 'noopener,noreferrer');
      }
    };

    if (bannerLoading) {
      return (
        <Box 
          sx={{ 
            width: '100%', 
            height: 100, 
            bgcolor: '#f5f5f5', 
            mb: 2, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (bannerError || !bannerAd) {
      return (
        <Box 
          sx={{ 
            width: '100%', 
            height: 100, 
            bgcolor: '#E0E0E0', 
            mb: 2, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            borderRadius: 1,
            position: 'relative',
          }}
        >
          {bannerError ? 'Failed to load ad' : '970 x 100'}
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute', 
              bottom: 5, 
              right: 10, 
              fontSize: '0.6rem',
              color: '#AAA' 
            }}
          >
            NewzTok Ad
          </Typography>
        </Box>
      );
    }

    // If we have a valid banner ad, display it
    return (
      <Box 
        component="a"
        href={bannerAd.redirectUrl || bannerAd.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAdClick}
        sx={{ 
          width: '100%', 
          height: 100, 
          mb: 2, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          overflow: 'hidden',
          textDecoration: 'none',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        {bannerAd.imageUrl ? (
          <Box 
            component="img"
            src={bannerAd.imageUrl.startsWith('http') ? bannerAd.imageUrl : `${baseUrl}${bannerAd.imageUrl.startsWith('/') ? '' : '/'}${bannerAd.imageUrl}`}
            alt={bannerAd.title || "Advertisement"}
            sx={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
            }}
            onError={(e) => {
              console.error('Banner image failed to load');
              e.target.onerror = null; 
              e.target.src = "https://via.placeholder.com/970x100?text=Advertisement";
            }}
          />
        ) : (
          <Box 
            sx={{ 
              width: '100%', 
              height: '100%', 
              bgcolor: '#E0E0E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
            }}
          >
            {bannerAd.title || "Advertisement"}
          </Box>
        )}
        
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute', 
            bottom: 5, 
            right: 10, 
            fontSize: '0.6rem',
            color: '#FFF',
            bgcolor: 'rgba(0,0,0,0.5)',
            px: 0.5,
            borderRadius: 0.5
          }}
        >
          Ad
        </Typography>
      </Box>
    );
  };

  // 380 x 350 Advertisement component
  const SideAd = () => {
    const [sideAd, setSideAd] = useState(null);
    const [sideError, setSideError] = useState(null);
    const [sideLoading, setSideLoading] = useState(true);

    useEffect(() => {
      const fetchSideAd = async () => {
        try {
          setSideLoading(true);
          setSideError(null);
          console.log('Fetching side ad from API...');
          
          const response = await axios.get(`${baseUrl}/api/ads/public/web/side`);
          console.log('Side ad API response:', response.data);
          
          if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            // Take the first ad from the array
            const ad = response.data.data[0];
            // Log the redirect URL for debugging
            console.log('Side ad redirect URL:', ad.redirectUrl);
            setSideAd(ad);
          } else if (response.data && !Array.isArray(response.data)) {
            setSideAd(response.data);
          } else {
            setSideError('No ads available');
          }
        } catch (err) {
          console.error('Error fetching side ad:', err);
          setSideError(err.message || 'Failed to load advertisement');
        } finally {
          setSideLoading(false);
        }
      };

      fetchSideAd();
    }, []);

    // Handle ad click
    const handleAdClick = (e) => {
      e.preventDefault();
      if (sideAd && sideAd.redirectUrl) {
        console.log('Redirecting to side ad URL:', sideAd.redirectUrl);
        window.open(sideAd.redirectUrl, '_blank', 'noopener,noreferrer');
      }
    };

    if (sideLoading) {
      return (
        <Box 
          sx={{ 
            width: '100%', 
            height: 350, 
            bgcolor: '#f5f5f5', 
            mb: 3, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (sideError || !sideAd) {
      return (
        <Box 
          sx={{ 
            width: '100%', 
            height: 350, 
            bgcolor: '#E0E0E0', 
            mb: 3, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            borderRadius: 1,
            position: 'relative',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {sideError ? 'Failed to load ad' : '380 x 350'}
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute', 
              bottom: 5, 
              right: 10, 
              fontSize: '0.6rem',
              color: '#AAA' 
            }}
          >
            NewzTok Ad
          </Typography>
        </Box>
      );
    }

    // If we have a valid side ad, display it
    return (
      <Box 
        component="a"
        href={sideAd.redirectUrl || sideAd.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAdClick}
        sx={{ 
          width: '100%', 
          height: 350, 
          mb: 3, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          overflow: 'hidden',
          textDecoration: 'none',
          position: 'relative',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          cursor: 'pointer',
        }}
      >
        {sideAd.imageUrl ? (
          <Box 
            component="img"
            src={sideAd.imageUrl.startsWith('http') ? sideAd.imageUrl : `${baseUrl}${sideAd.imageUrl.startsWith('/') ? '' : '/'}${sideAd.imageUrl}`}
            alt={sideAd.title || "Advertisement"}
            sx={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
            }}
            onError={(e) => {
              console.error('Side ad image failed to load');
              e.target.onerror = null; 
              e.target.src = "https://via.placeholder.com/380x350?text=Advertisement";
            }}
          />
        ) : (
          <Box 
            sx={{ 
              width: '100%', 
              height: '100%', 
              bgcolor: '#E0E0E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
            }}
          >
            {sideAd.title || "Advertisement"}
          </Box>
        )}
        
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute', 
            bottom: 5, 
            right: 10, 
            fontSize: '0.6rem',
            color: '#FFF',
            bgcolor: 'rgba(0,0,0,0.5)',
            px: 0.5,
            borderRadius: 0.5
          }}
        >
          Ad
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, md: 4 } }}>
        {/* TRENDING SECTION - Moved to the top */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 4,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#FF5722',
              borderRadius: 1
            }
          }}
        >
          TRENDING NEWS
        </Typography>

        {loading.trending ? (
          <LoadingSection />
        ) : error.trending ? (
          <ErrorSection message={error.trending} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
            {/* Left Side - News Cards */}
            <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {trendingNews.length > 0 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={trendingNews[0]} 
                    categoryLabel="TRENDING"
                    categoryColor="#FF5722"
                    isLarge={true}
                  />
                </Box>
              )}
              
              {trendingNews.length > 1 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={trendingNews[1]}
                    categoryLabel="TRENDING"
                    categoryColor="#FF5722" 
                    isLarge={true}
                  />
                </Box>
              )}
            </Box>
            
            {/* Right Side - Sidebar */}
            <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Advertisement */}
              <SideAd />
              
              {/* Category Tabs
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {categoryTabs.map((tab, index) => (
                  <CategoryTab key={index} name={tab.name} count={tab.count} />
                ))}
              </Box> */}
            </Box>
          </Box>
        )}

        {/* Second row of trending news cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mt: 3, mb: 3 }}>
          {trendingNews.length > 2 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={trendingNews[2]} 
                categoryLabel="TRENDING"
                categoryColor="#FF5722"
                isLarge={true}
              />
            </Box>
          )}
          
          {trendingNews.length > 3 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={trendingNews[3]}
                categoryLabel="TRENDING"
                categoryColor="#FF5722" 
                isLarge={true}
              />
            </Box>
          )}
        </Box>

        {/* Advertisement after Trending */}
        <LargeAd />
        
        {/* First Section - Top Grid (First Image Layout) */}
        <Grid container spacing={2} sx={{ mb: -40 }}>
          {/* Large card on left */}
          <Grid item xs={12} md={6}>
            {trendingNews.length > 2 && (
              <NewsCard 
                item={trendingNews[2]}
                categoryLabel="TRENDING"
                categoryColor="#FF5722"
                isLarge={true}
              />
            )}
          </Grid>
          
          {/* 2x2 grid on right */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {sportsNews.length > 0 && (
                  <NewsCard 
                    item={sportsNews[0]}
                    categoryLabel="SPORTS"
                    categoryColor="#4CAF50"
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {sportsNews.length > 1 && (
                  <NewsCard 
                    item={sportsNews[1]}
                    categoryLabel="SPORTS"
                    categoryColor="#4CAF50"
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {trendingNews.length > 3 && (
                  <NewsCard 
                    item={trendingNews[3]}
                    categoryLabel="TRENDING"
                    categoryColor="#FF5722"
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {nationalNews.length > 0 && (
                  <NewsCard 
                    item={nationalNews[0]}
                    categoryLabel="NATIONAL"
                    categoryColor="#D32F2F"
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* NATIONAL SECTION */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#D32F2F',
              borderRadius: 1
            }
          }}
        >
          NATIONAL NEWS
        </Typography>

        {loading.national ? (
          <LoadingSection />
        ) : error.national ? (
          <ErrorSection message={error.national} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 1 }}>
            {/* Left Side - News Cards */}
            <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {nationalNews.length > 1 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={nationalNews[1]}
                    categoryLabel="NATIONAL"
                    categoryColor="#D32F2F"
                    isLarge={true}
                  />
                </Box>
              )}
              
              {nationalNews.length > 2 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={nationalNews[2]}
                    categoryLabel="NATIONAL"
                    categoryColor="#D32F2F"
                    isLarge={true}
                  />
                </Box>
              )}
            </Box>
            
            {/* Right Side - Advertisement */}
            <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <SideAd />
            </Box>
          </Box>
        )}
        
        {/* Second row of national news cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mt: 3, mb: 3 }}>
          {nationalNews.length > 3 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={nationalNews[3]} 
                categoryLabel="NATIONAL"
                categoryColor="#D32F2F"
                isLarge={true}
              />
            </Box>
          )}
          
          {nationalNews.length > 4 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={nationalNews[4]}
                categoryLabel="NATIONAL"
                categoryColor="#D32F2F" 
                isLarge={true}
              />
            </Box>
          )}
        </Box>

        {/* Advertisement after National */}
        <LargeAd />

        {/* INTERNATIONAL SECTION */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#1976D2',
              borderRadius: 1
            }
          }}
        >
          INTERNATIONAL NEWS
        </Typography>

        {loading.international ? (
          <LoadingSection />
        ) : error.international ? (
          <ErrorSection message={error.international} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
            {/* Left Side - News Cards */}
            <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {internationalNews.length > 0 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={internationalNews[0]}
                    categoryLabel="INTERNATIONAL"
                    categoryColor="#1976D2"
                    isLarge={true}
                  />
                </Box>
              )}
              
              {internationalNews.length > 1 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={internationalNews[1]}
                    categoryLabel="INTERNATIONAL"
                    categoryColor="#1976D2"
                    isLarge={true}
                  />
                </Box>
              )}
            </Box>
            
            {/* Right Side - Advertisement */}
            <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <SideAd />
            </Box>
          </Box>
        )}
        
        {/* Second row of international news cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mt: 3, mb: 3 }}>
          {internationalNews.length > 2 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={internationalNews[2]} 
                categoryLabel="INTERNATIONAL"
                categoryColor="#1976D2"
                isLarge={true}
              />
            </Box>
          )}
          
          {internationalNews.length > 3 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={internationalNews[3]}
                categoryLabel="INTERNATIONAL"
                categoryColor="#1976D2" 
                isLarge={true}
              />
            </Box>
          )}
        </Box>

        {/* Advertisement after International */}
        <LargeAd />

        {/* SPORTS SECTION */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#4CAF50',
              borderRadius: 1
            }
          }}
        >
          SPORTS NEWS
        </Typography>

        {loading.sports ? (
          <LoadingSection />
        ) : error.sports ? (
          <ErrorSection message={error.sports} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
            {/* Left Side - News Cards */}
            <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {sportsNews.length > 2 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={sportsNews[2]}
                    categoryLabel="SPORTS"
                    categoryColor="#4CAF50"
                    isLarge={true}
                  />
                </Box>
              )}
              
              {sportsNews.length > 3 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={sportsNews[3]}
                    categoryLabel="SPORTS"
                    categoryColor="#4CAF50"
                    isLarge={true}
                  />
                </Box>
              )}
            </Box>
            
            {/* Right Side - Advertisement */}
            <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <SideAd />
            </Box>
          </Box>
        )}
        
        {/* Second row of sports news cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mt: 3, mb: 3 }}>
          {sportsNews.length > 0 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={sportsNews[0]} 
                categoryLabel="SPORTS"
                categoryColor="#4CAF50"
                isLarge={true}
              />
            </Box>
          )}
          
          {sportsNews.length > 1 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={sportsNews[1]}
                categoryLabel="SPORTS"
                categoryColor="#4CAF50" 
                isLarge={true}
              />
            </Box>
          )}
        </Box>

        {/* Advertisement after Sports */}
        <LargeAd />

        {/* STATE NEWS SECTION */}
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#FFC107',
              borderRadius: 1
            }
          }}
        >
          STATE NEWS
        </Typography>

        {loading.state ? (
          <LoadingSection />
        ) : error.state ? (
          <ErrorSection message={error.state} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
            {/* Left Side - News Cards */}
            <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {stateNews.length > 0 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={stateNews[0]}
                    categoryLabel="STATE"
                    categoryColor="#FFC107"
                    isLarge={true}
                  />
                </Box>
              )}
              
              {stateNews.length > 1 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={stateNews[1]}
                    categoryLabel="STATE"
                    categoryColor="#FFC107"
                    isLarge={true}
                  />
                </Box>
              )}
            </Box>
            
            {/* Right Side - Advertisement */}
            <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <SideAd />
            </Box>
          </Box>
        )}
        
        {/* Second row of state news cards (these may not show if only 2 items exist) */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mt: 3, mb: 3 }}>
          {stateNews.length > 2 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={stateNews[2]} 
                categoryLabel="STATE"
                categoryColor="#FFC107"
                isLarge={true}
              />
            </Box>
          )}
          
          {stateNews.length > 3 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={stateNews[3]}
                categoryLabel="STATE"
                categoryColor="#FFC107" 
                isLarge={true}
              />
            </Box>
          )}
        </Box>

        {/* Last Advertisement */}
        <LargeAd />

        {/* ENTERTAINMENT SECTION - Keeping as the last section */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#9C27B0',
              borderRadius: 1
            }
          }}
        >
          ENTERTAINMENT NEWS
        </Typography>

        {loading.entertainment ? (
          <LoadingSection />
        ) : error.entertainment ? (
          <ErrorSection message={error.entertainment} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
            {/* Left Side - News Cards */}
            <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {entertainmentNews.length > 0 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={entertainmentNews[0]}
                    categoryLabel="ENTERTAINMENT"
                    categoryColor="#9C27B0"
                    isLarge={true}
                  />
                </Box>
              )}
              
              {entertainmentNews.length > 1 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard 
                    item={entertainmentNews[1]}
                    categoryLabel="ENTERTAINMENT"
                    categoryColor="#9C27B0"
                    isLarge={true}
                  />
                </Box>
              )}
            </Box>
            
            {/* Right Side - Advertisement */}
            <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <SideAd />
            </Box>
          </Box>
        )}
        
        {/* Second row of entertainment news cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mt: 3, mb: 3 }}>
          {entertainmentNews.length > 2 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={entertainmentNews[2]} 
                categoryLabel="ENTERTAINMENT"
                categoryColor="#9C27B0"
                isLarge={true}
              />
            </Box>
          )}
          
          {entertainmentNews.length > 3 && (
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                item={entertainmentNews[3]}
                categoryLabel="ENTERTAINMENT"
                categoryColor="#9C27B0" 
                isLarge={true}
              />
            </Box>
          )}
        </Box>

        {/* Final Advertisement */}
        <LargeAd />
      </Container>
    </Box>
  );
};

export default HomeScreen; 