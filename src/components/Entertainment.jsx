import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Entertainment = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [secondSectionNews, setSecondSectionNews] = useState([]);
  const [additionalNews, setAdditionalNews] = useState([]);
  const [fourthSectionNews, setFourthSectionNews] = useState([]);
  const [fifthSectionNews, setFifthSectionNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category tabs data
  const categoryTabs = [
    { name: 'Movies', count: '15' },
    { name: 'Music', count: '12' },
    { name: 'TV Shows', count: '9' },
  ];

  // Social media stats
  const socialStats = [
    { platform: 'facebook', icon: 'https://cdn.iconscout.com/icon/free/png-256/free-facebook-logo-2019-1597680-1350125.png', count: '35.8k', label: 'likes' },
    { platform: 'instagram', icon: 'https://static.vecteezy.com/system/resources/previews/017/743/717/original/instagram-icon-logo-free-png.png', count: '42.3k', label: 'followers' },
    { platform: 'twitter', icon: 'https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png', count: '28.7k', label: 'followers' },
    { platform: 'youtube', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png', count: '50.2k', label: 'subscribers' },
  ];

  useEffect(() => {
    fetchEntertainmentNews();
  }, []);

  const fetchEntertainmentNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching entertainment news from endpoint...');
      const response = await axios.get('http://13.234.42.114:3333/api/news/category/entertainment');
      console.log('API Response:', response);
      
      let fetchedNews = [];
      if (response.data && Array.isArray(response.data)) {
        console.log(`Successfully fetched ${response.data.length} entertainment news items`);
        fetchedNews = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log(`Successfully fetched ${response.data.data.length} entertainment news items from data property`);
        fetchedNews = response.data.data;
      } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
        console.log(`Successfully fetched ${response.data.posts.length} entertainment news items from posts property`);
        fetchedNews = response.data.posts;
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setError('Unexpected data format received from server');
        fetchedNews = [];
      }
      
      // Log each fetched news item to debug
      fetchedNews.forEach((item, index) => {
        console.log(`News item ${index + 1}:`, {
          id: item.id,
          title: item.title,
          featuredImage: item.featuredImage,
          image: item.image,
          images: item.images,
          category: item.category
        });
      });
      
      console.log(`Total fetched news items: ${fetchedNews.length}`);
      
      // Clear existing news items
      setNewsItems([]);
      setSecondSectionNews([]);
      setAdditionalNews([]);
      setFourthSectionNews([]);
      setFifthSectionNews([]);
      
      // Distribute fetched news to different sections
      if (fetchedNews.length >= 1) {
        console.log(`Setting first ${Math.min(fetchedNews.length, 2)} items as main news`);
        setNewsItems(fetchedNews.slice(0, Math.min(fetchedNews.length, 2)));
      }
      
      if (fetchedNews.length >= 3) {
        console.log('Setting items starting from index 2 as second section news');
        setSecondSectionNews(fetchedNews.slice(2, 4));
      }
      
      if (fetchedNews.length >= 5) {
        console.log('Setting items starting from index 4 as additional news');
        setAdditionalNews(fetchedNews.slice(4, 6));
      }
      
      if (fetchedNews.length >= 7) {
        console.log('Setting items starting from index 6 as fourth section news');
        setFourthSectionNews(fetchedNews.slice(6, 8));
      }
      
      if (fetchedNews.length >= 9) {
        console.log('Setting items starting from index 8 as fifth section news');
        setFifthSectionNews(fetchedNews.slice(8, 10));
      }
    } catch (err) {
      console.error('Error fetching entertainment news:', err);
      
      // Better error message based on the error type
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with error:', err.response.status, err.response.data);
        setError(`Server error (${err.response.status}): ${err.response.data.message || 'Unable to fetch news'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received from server');
        setError('Network error: No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date function for consistent display
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

  // News card component
  const NewsCard = ({ item }) => {
    const [imageError, setImageError] = useState(false);
    
    const handleImageError = () => {
      console.error(`Error loading image for "${item.title}"`);
      setImageError(true);
    };
    
    // Get image URL with proper handling
    const getImageUrl = () => {
      console.log(`Getting image URL for item with title "${item.title}":`, {
        id: item.id,
        featuredImage: item.featuredImage,
        image: item.image,
        images: item.images
      });
      
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
          const fullUrl = `http://13.234.42.114:3333${item.featuredImage}`;
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
          const fullUrl = `http://13.234.42.114:3333${item.image}`;
          console.log(`Using relative image with base URL for "${item.title}": ${fullUrl}`);
          return fullUrl;
        }
      }
      
      // Fallback to placeholder
      console.log(`No image found for "${item.title}", using placeholder`);
      return '/entertainment-news-placeholder.jpg';
    };
    
    const imageUrl = getImageUrl();
    
    // Debug image URL
    useEffect(() => {
      console.log(`Image URL for "${item.title}":`, imageUrl);
    }, [imageUrl, item.title]);
    
    return (
      <Box sx={{ position: 'relative', height: '100%', mb: 2 }}>
        <Card 
          sx={{ 
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            height: 360,
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            backgroundColor: 'white',
          }}
        >
          {!imageError ? (
            <CardMedia
              component="img"
              height="360"
              image={imageUrl}
              alt={item.title}
              onError={handleImageError}
              sx={{
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                height: 360,
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
              }}
            >
              Image not available
            </Box>
          )}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 2,
              backgroundColor: '#8E24AA',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              padding: '6px 16px',
              borderRadius: '4px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {item.category || 'ENTERTAINMENT'}
          </Box>
        </Card>
        
        <Box sx={{ pt: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'black',
              fontWeight: '700',
              mb: 1,
              lineHeight: 1.3,
              fontSize: '1rem',
            }}
          >
            {item.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                color: '#777',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#888888"/>
                <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#888888"/>
              </svg>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: '#666',
                fontSize: '0.8rem',
              }}
            >
              {formatDate(item.createdAt || item.publishedAt || item.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };
  
  // Second section news card component with different style
  const SecondSectionNewsCard = ({ item }) => {
    const [imageError, setImageError] = useState(false);
    
    const handleImageError = () => {
      console.error(`Error loading image for "${item.title}"`);
      setImageError(true);
    };
    
    // Get image URL with proper handling
    const getImageUrl = () => {
      console.log(`Getting image URL for item:`, item);
      
      // If item has images array with content
      if (item.images && item.images.length > 0) {
        console.log(`Using images[0] from array: ${item.images[0]}`);
        return item.images[0];
      }
      
      // If item has featuredImage
      if (item.featuredImage) {
        // Check if it's a full URL or just a path
        if (item.featuredImage.startsWith('http')) {
          console.log(`Using full featuredImage URL: ${item.featuredImage}`);
          return item.featuredImage;
        } else {
          // Add base URL for relative paths
          const fullUrl = `http://13.234.42.114:3333${item.featuredImage}`;
          console.log(`Using relative featuredImage with base URL: ${fullUrl}`);
          return fullUrl;
        }
      }
      
      // If item has image property
      if (item.image) {
        // Check if it's a full URL or just a path
        if (item.image.startsWith('http')) {
          console.log(`Using full image URL: ${item.image}`);
          return item.image;
        } else {
          // Add base URL for relative paths
          const fullUrl = `http://13.234.42.114:3333${item.image}`;
          console.log(`Using relative image with base URL: ${fullUrl}`);
          return fullUrl;
        }
      }
      
      // Fallback to placeholder
      console.log('No image found, using placeholder');
      return '/entertainment-news-placeholder.jpg';
    };
    
    const imageUrl = getImageUrl();
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4, height: '100%' }}>
        <Card 
          sx={{ 
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            height: 280,
            backgroundColor: 'white',
          }}
        >
          {!imageError ? (
            <CardMedia
              component="img"
              height="280"
              image={imageUrl}
              alt={item.title}
              onError={handleImageError}
              sx={{
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                height: 280,
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
              }}
            >
              Image not available
            </Box>
          )}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 2,
              backgroundColor: '#8E24AA',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              padding: '6px 16px',
              borderRadius: '4px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {item.category || 'ENTERTAINMENT'}
          </Box>
        </Card>
        
        <Box sx={{ pt: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'black',
              fontWeight: '700',
              mb: 1,
              lineHeight: 1.3,
              fontSize: '1rem',
              height: '2.6rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {item.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="https://cdn-icons-png.flaticon.com/512/3524/3524636.png"
              alt="clock"
              sx={{ 
                width: 16,
                height: 16,
                mr: 1,
                opacity: 0.7
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: '#666',
                fontSize: '0.8rem',
              }}
            >
              {formatDate(item.createdAt || item.publishedAt || item.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };
  
  // Category tab component
  const CategoryTab = ({ name, count }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingY: 2,
        paddingX: 2.5,
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        cursor: 'pointer',
        backgroundColor: 'white',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(142, 36, 170, 0.05)',
        },
      }}
    >
      <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
        {name}
      </Typography>
      <Box
        sx={{
          backgroundColor: 'rgba(142, 36, 170, 0.1)',
          color: '#8E24AA',
          borderRadius: '20px',
          px: 1.5,
          py: 0.5,
          fontSize: '0.75rem',
          fontWeight: 'bold',
          minWidth: '36px',
          textAlign: 'center',
        }}
      >
        {count}
      </Box>
    </Box>
  );

  // Loading component
  const LoadingSpinner = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '300px',
        width: '100%'
      }}
    >
      <CircularProgress sx={{ color: '#8E24AA' }} />
    </Box>
  );

  // Error component
  const ErrorMessage = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '300px',
        width: '100%',
        color: 'red',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {error}
      </Typography>
      <Typography 
        variant="body2" 
        component="button"
        onClick={fetchEntertainmentNews}
        sx={{ 
          background: 'none', 
          border: 'none', 
          color: '#8E24AA', 
          cursor: 'pointer',
          textDecoration: 'underline',
          mt: 2
        }}
      >
        Try Again
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
      {/* Entertainment Header */}
      <Box 
        sx={{ 
          width: '100%', 
          position: 'relative',
          py: 5,
          color: 'white',
          textAlign: 'center',
          mb: 8,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #8E24AA 0%, #6A1B9A 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%), 
                              radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%)`,
            zIndex: 1
          }
        }}
      >
        {/* Film Strip Top */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '20px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20' viewBox='0 0 100 20'%3E%3Crect x='0' y='0' width='100' height='20' fill='%23000000' fill-opacity='0.3'/%3E%3Crect x='5' y='5' width='10' height='10' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3Crect x='25' y='5' width='10' height='10' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3Crect x='45' y='5' width='10' height='10' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3Crect x='65' y='5' width='10' height='10' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3Crect x='85' y='5' width='10' height='10' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            zIndex: 2
          }}
        />
        
        {/* Film Strip Bottom */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '20px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20' viewBox='0 0 100 20'%3E%3Crect x='0' y='0' width='100' height='20' fill='%23000000' fill-opacity='0.3'/%3E%3Crect x='5' y='5' width='10' height='10' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3Crect x='25' y='5' width='10' height='10' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3Crect x='45' y='5' width='10' height='10' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3Crect x='65' y='5' width='10' height='10' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3Crect x='85' y='5' width='10' height='10' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            zIndex: 2
          }}
        />
        
        {/* Movie Clapper */}
        <Box 
          sx={{
            position: 'absolute',
            top: '20%',
            left: '12%',
            width: '50px',
            height: '45px',
            zIndex: 2,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.1 4H9.5L9.2 2.1C9.1 1.5 8.6 1 8 1H4.1C3 1 2.1 1.9 2.1 3V21C2.1 22.1 3 23 4.1 23H20.1C21.2 23 22.1 22.1 22.1 21V6C22.1 4.9 21.2 4 20.1 4ZM4.1 3H8L8.3 4.1C8.4 4.7 8.9 5.1 9.5 5.1H20.1V7.1H4.1V3ZM20.1 21H4.1V9.1H20.1V21Z" fill="white"/>
            <path d="M13.1 10.1L11.1 18.1" stroke="white" strokeWidth="2"/>
            <path d="M8.1 10.1L6.1 18.1" stroke="white" strokeWidth="2"/>
            <path d="M18.1 10.1L16.1 18.1" stroke="white" strokeWidth="2"/>
          </svg>
        </Box>
        
        {/* Music Note */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '15%',
            width: '40px',
            height: '40px',
            zIndex: 2,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12Z" fill="white"/>
          </svg>
        </Box>
        
        {/* Camera Icon */}
        <Box 
          sx={{
            position: 'absolute',
            top: '60%',
            left: '20%',
            width: '40px',
            height: '40px',
            zIndex: 2,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9ZM12 18C9.24 18 7 15.76 7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 15.76 14.76 18 12 18Z" fill="white"/>
            <circle cx="12" cy="13" r="3.5" fill="#AB47BC"/>
          </svg>
        </Box>
        
        {/* Star Icon */}
        <Box 
          sx={{
            position: 'absolute',
            top: '30%',
            right: '18%',
            width: '35px',
            height: '35px',
            zIndex: 2,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="#FFD54F"/>
          </svg>
        </Box>
        
        {/* TV Icon */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: '35%',
            left: '25%',
            width: '40px',
            height: '40px',
            zIndex: 2,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 3H3C1.9 3 1 3.9 1 5V17C1 18.1 1.9 19 3 19H8V21H16V19H21C22.1 19 23 18.1 23 17V5C23 3.9 22.1 3 21 3ZM21 17H3V5H21V17Z" fill="white"/>
          </svg>
        </Box>
        
        {/* Oscar Statue */}
        <Box 
          sx={{
            position: 'absolute',
            top: '65%',
            right: '12%',
            width: '25px',
            height: '45px',
            zIndex: 2,
          }}
        >
          <svg viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C8.7 0 6 2.7 6 6C6 7.8 6.8 9.4 8 10.4V14H16V10.4C17.2 9.4 18 7.8 18 6C18 2.7 15.3 0 12 0Z" fill="#FFD700"/>
            <path d="M11 14V36M13 14V36" stroke="#FFD700" strokeWidth="2"/>
            <path d="M8 32H16V36H8V32Z" fill="#FFD700"/>
          </svg>
        </Box>
                
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3 }}>
          <Box sx={{ 
            display: 'inline-block',
            px: 5, 
            py: 2,
            position: 'relative',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 3,
            backdropFilter: 'blur(3px)'
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              fontWeight="bold" 
              sx={{ 
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                position: 'relative',
                display: 'inline-block'
              }}
            >
              Entertainment News
              <Box
                sx={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-40px',
                  backgroundColor: '#FF4081',
                  color: 'white',
                  fontSize: '0.9rem',
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  transform: 'rotate(15deg)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                HOT
              </Box>
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
                textShadow: '1px 1px 2px rgba(0,0,0,0.4)'
              }}
            >
              Movies · Music · Television · Celebrity · Bollywood · Hollywood
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content - First Section */}
      <Container 
        sx={{ 
          maxWidth: { xs: '95%', sm: '90%', md: '1200px' }, 
          mx: 'auto',
          mb: 8
        }}
      >
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 } }}>
            {/* Left Side - News Cards */}
            <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {newsItems.length >= 1 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard item={newsItems[0]} />
                </Box>
              )}
              
              {newsItems.length >= 2 && (
                <Box sx={{ flex: 1 }}>
                  <NewsCard item={newsItems[1]} />
                </Box>
              )}
            </Box>
            
            {/* Right Side - Ad and Social Media */}
            <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Advertisement */}
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 350, 
                  bgcolor: '#E0E0E0', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  borderRadius: 0,
                  position: 'relative',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                380 x 350
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
                  Powered by HTML.COM
                </Typography>
              </Box>
              
              {/* Social Media Stats */}
              <Box 
                sx={{ 
                  p: 2,
                  backgroundColor: 'white',
                  borderRadius: 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <Grid container spacing={1}>
                  {socialStats.map((stat) => (
                    <Grid item xs={3} key={stat.platform} sx={{ textAlign: 'center', p: 1.5 }}>
                      <Box 
                        component="img" 
                        src={stat.icon} 
                        alt={stat.platform} 
                        sx={{ 
                          width: 24, 
                          height: 24,
                          mb: 0.5,
                          objectFit: 'contain'
                        }}
                      />
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 0 }}>
                        {stat.count}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                        {stat.label}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Box>
        )}
      </Container>

      {/* Second Section - Scrollable News and Fixed Sidebar */}
      {!loading && !error && (
        <Container 
          sx={{ 
            maxWidth: { xs: '95%', sm: '90%', md: '1200px' }, 
            mx: 'auto',
            position: 'relative',
            mb: 8
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 } }}>
            {/* Left Side - Scrollable News Cards */}
            <Box 
              sx={{ 
                flex: 7, 
                maxHeight: { md: '1200px' },
                overflowY: { md: 'auto' },
                pr: { md: 2 },
                msOverflowStyle: 'none', /* IE and Edge */
                scrollbarWidth: 'none', /* Firefox */
                '&::-webkit-scrollbar': {
                  display: 'none', /* Chrome, Safari, Opera */
                }
              }}
            >
              {secondSectionNews.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
                  {secondSectionNews.map((news, index) => (
                    <Box sx={{ flex: 1 }} key={news.id || index}>
                      <SecondSectionNewsCard item={news} />
                    </Box>
                  ))}
                </Box>
              )}
              
              {additionalNews.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
                  {additionalNews.map((news, index) => (
                    <Box sx={{ flex: 1 }} key={news.id || index}>
                      <SecondSectionNewsCard item={news} />
                    </Box>
                  ))}
                </Box>
              )}
              
              {fourthSectionNews.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
                  {fourthSectionNews.map((news, index) => (
                    <Box sx={{ flex: 1 }} key={news.id || index}>
                      <SecondSectionNewsCard item={news} />
                    </Box>
                  ))}
                </Box>
              )}
              
              {fifthSectionNews.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
                  {fifthSectionNews.map((news, index) => (
                    <Box sx={{ flex: 1 }} key={news.id || index}>
                      <SecondSectionNewsCard item={news} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            
            {/* Right Side - Fixed Category Tabs and Ad */}
            <Box 
              sx={{ 
                flex: 3, 
                position: { md: 'sticky' },
                top: { md: '20px' },
                alignSelf: { md: 'flex-start' },
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3 
              }}
            >
              {/* Category Tabs */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {categoryTabs.map((tab, index) => (
                  <CategoryTab key={index} name={tab.name} count={tab.count} />
                ))}
              </Box>
              
              {/* Advertisement */}
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 350, 
                  bgcolor: '#E0E0E0', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  borderRadius: 0,
                  position: 'relative',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                380 x 350
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
                  Powered by HTML.COM
                </Typography>
              </Box>
              
              {/* Recent Posts Heading */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" fontWeight="bold">
                  Recent Posts
                </Typography>
                <Divider sx={{ mt: 2, mb: 2, borderColor: 'rgba(0,0,0,0.1)' }} />
              </Box>
            </Box>
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default Entertainment; 