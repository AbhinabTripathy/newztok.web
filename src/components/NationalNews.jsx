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
} from '@mui/material';
import axios from 'axios';
import { useStateContext } from './Header'; // Import the state context
import { Link } from 'react-router-dom';

const NationalNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedState } = useStateContext(); // Get the selected state from context

  useEffect(() => {
    fetchNationalNews();
  }, [selectedState]); // Re-fetch when selected state changes

  const fetchNationalNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://13.234.42.114:3333/api/news/category/national');
      console.log('National news API response:', response.data);
      
      // Process data from API
      let fetchedNews = [];
      if (Array.isArray(response.data)) {
        fetchedNews = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        fetchedNews = response.data.data;
      }
      
      // Filter news by selected state if one is selected
      if (selectedState) {
        console.log(`Filtering national news by state: ${selectedState}`);
        
        // First, try to match exact state name
        let filteredNews = fetchedNews.filter(item => 
          item.state && (item.state.includes(selectedState) || selectedState.includes(item.state))
        );
        
        // If no exact matches, check if state is mentioned in the content or title
        if (filteredNews.length === 0) {
          filteredNews = fetchedNews.filter(item => 
            (item.content && item.content.includes(selectedState)) || 
            (item.title && item.title.includes(selectedState))
          );
        }
        
        // If we found filtered results, use them; otherwise, fall back to all news
        if (filteredNews.length > 0) {
          console.log(`Found ${filteredNews.length} news items for state: ${selectedState}`);
          fetchedNews = filteredNews;
        } else {
          console.log(`No news items found for state: ${selectedState}, showing all national news`);
        }
      }
      
      setNewsItems(fetchedNews);
      
      // Preload images to improve performance
      fetchedNews.forEach(item => {
        if (item.featuredImage || item.image) {
          const getFullImageUrl = (imagePath) => {
            if (!imagePath) return null;
            if (imagePath.startsWith('http')) return imagePath;
            return `http://13.234.42.114:3333${imagePath}`;
          };
          
          const imageUrl = getFullImageUrl(item.featuredImage || item.image);
          if (imageUrl) {
            const img = new Image();
            img.src = imageUrl;
            console.log(`Preloading image: ${imageUrl}`);
          }
        }
      });
    } catch (err) {
      console.error('Error fetching national news:', err);
      setError('Failed to load national news. Please try again later.');
    } finally {
      setLoading(false);
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

  // Category tabs data
  const categoryTabs = [
    { name: 'Politics', count: '18' },
    { name: 'Economy', count: '14' },
    { name: 'Society', count: '10' },
  ];

  // Social media stats
  const socialStats = [
    { platform: 'facebook', icon: 'https://cdn.iconscout.com/icon/free/png-256/free-facebook-logo-2019-1597680-1350125.png', count: '45.2k', label: 'likes' },
    { platform: 'instagram', icon: 'https://static.vecteezy.com/system/resources/previews/017/743/717/original/instagram-icon-logo-free-png.png', count: '38.7k', label: 'followers' },
    { platform: 'twitter', icon: 'https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png', count: '52.1k', label: 'followers' },
    { platform: 'youtube', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png', count: '31.9k', label: 'subscribers' },
  ];

  // News card component updated to handle API data
  const NewsCard = ({ item }) => {
    // Check if item has youtubeUrl for video content
    const isVideo = item.youtubeUrl || item.contentType === 'video';
    
    // Add base URL to image path if it's a relative path
    const getFullImageUrl = (imagePath) => {
      if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
      if (imagePath.startsWith('http')) return imagePath;
      return `http://13.234.42.114:3333${imagePath}`;
    };
    
    const mediaUrl = getFullImageUrl(item.featuredImage || item.image);
    
    // State for image loading and errors
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Extract YouTube video ID if available
    const getYoutubeEmbedUrl = (url) => {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11)
        ? `https://www.youtube.com/embed/${match[2]}`
        : null;
    };
    
    const youtubeEmbedUrl = getYoutubeEmbedUrl(item.youtubeUrl);
    
    // Get formatted date
    const formatDate = (dateString) => {
      if (!dateString) return 'No date';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return dateString;
      }
    };

    // Log the image URL for debugging
    useEffect(() => {
      console.log(`Loading image for "${item.title}": ${mediaUrl}`);
    }, [mediaUrl, item.title]);

    return (
      <Box sx={{ position: 'relative', height: '100%', mb: 2 }}>
        <Link 
          to={`/national/${item.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
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
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            {isVideo && youtubeEmbedUrl ? (
              <iframe
                width="100%"
                height="360"
                src={youtubeEmbedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={item.title}
              />
            ) : (
              <>
                {!imageLoaded && !imageError && (
                  <Box 
                    sx={{ 
                      height: 360, 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#f0f0f0',
                      color: '#777'
                    }}
                  >
                    <CircularProgress size={30} sx={{ color: '#FF6F00' }} />
                  </Box>
                )}
                <CardMedia
                  component="img"
                  height="360"
                  image={mediaUrl}
                  alt={item.title}
                  sx={{
                    objectFit: 'cover',
                    display: !imageLoaded && !imageError ? 'none' : 'block',
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    console.error(`Error loading image for "${item.title}"`);
                    setImageError(true);
                  }}
                />
                {imageError && (
                  <Box 
                    sx={{ 
                      height: 360, 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#f0f0f0',
                      color: '#777',
                      flexDirection: 'column',
                      padding: 2,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Image not available
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.title || 'National News'}
                    </Typography>
                  </Box>
                )}
              </>
            )}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 2,
                backgroundColor: '#FF6F00',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                padding: '6px 16px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {item.category || 'National'}
            </Box>
          </Card>
        </Link>
        
        <Box sx={{ pt: 2 }}>
          <Link 
            to={`/national/${item.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'black',
                fontWeight: '700',
                mb: 1,
                lineHeight: 1.3,
                fontSize: '1rem',
                transition: 'color 0.2s ease',
                '&:hover': { 
                  color: '#FF6F00' 
                }
              }}
            >
              {item.title || 'No title available'}
            </Typography>
          </Link>
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
              {formatDate(item.createdAt || item.updatedAt || item.publishedAt)}
            </Typography>
          </Box>
          
          {/* Show state and district if available */}
          {(item.state || item.district) && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
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
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#888888"/>
                </svg>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#666',
                  fontSize: '0.8rem',
                }}
              >
                {[capitalizeFirstLetter(item.state), capitalizeFirstLetter(item.district)].filter(Boolean).join(', ')}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };
  
  // Second section news card component with different style
  const SecondSectionNewsCard = ({ item }) => {
    // Check if item has youtubeUrl for video content
    const isVideo = item.youtubeUrl || item.contentType === 'video';
    
    // Add base URL to image path if it's a relative path
    const getFullImageUrl = (imagePath) => {
      if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
      if (imagePath.startsWith('http')) return imagePath;
      return `http://13.234.42.114:3333${imagePath}`;
    };
    
    const mediaUrl = getFullImageUrl(item.featuredImage || item.image);
    
    // State for image loading and errors
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Extract YouTube video ID if available
    const getYoutubeEmbedUrl = (url) => {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11)
        ? `https://www.youtube.com/embed/${match[2]}`
        : null;
    };
    
    const youtubeEmbedUrl = getYoutubeEmbedUrl(item.youtubeUrl);
    
    // Get formatted date
    const formatDate = (dateString) => {
      if (!dateString) return 'No date';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return dateString;
      }
    };

    // Log the image URL for debugging
    useEffect(() => {
      console.log(`Loading image for "${item.title}": ${mediaUrl}`);
    }, [mediaUrl, item.title]);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4, height: '100%' }}>
        <Link 
          to={`/national/${item.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Card 
            sx={{ 
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              height: 280,
              backgroundColor: 'white',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            {isVideo && youtubeEmbedUrl ? (
              <iframe
                width="100%"
                height="280"
                src={youtubeEmbedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={item.title}
              />
            ) : (
              <>
                {!imageLoaded && !imageError && (
                  <Box 
                    sx={{ 
                      height: 280, 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#f0f0f0',
                      color: '#777'
                    }}
                  >
                    <CircularProgress size={30} sx={{ color: '#FF6F00' }} />
                  </Box>
                )}
                <CardMedia
                  component="img"
                  height="280"
                  image={mediaUrl}
                  alt={item.title}
                  sx={{
                    objectFit: 'cover',
                    display: !imageLoaded && !imageError ? 'none' : 'block'
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    console.error(`Error loading image for "${item.title}"`);
                    setImageError(true);
                  }}
                />
                {imageError && (
                  <Box 
                    sx={{ 
                      height: 280, 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#f0f0f0',
                      color: '#777',
                      flexDirection: 'column',
                      padding: 2,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Image not available
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.title || 'National News'}
                    </Typography>
                  </Box>
                )}
              </>
            )}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 2,
                backgroundColor: '#FF6F00',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                padding: '6px 16px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {item.category || 'National'}
            </Box>
          </Card>
        </Link>
        
        <Box sx={{ pt: 2 }}>
          <Link 
            to={`/national/${item.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
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
                transition: 'color 0.2s ease',
                '&:hover': { 
                  color: '#FF6F00' 
                }
              }}
            >
              {item.title || 'No title available'}
            </Typography>
          </Link>
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
              {formatDate(item.createdAt || item.updatedAt || item.publishedAt)}
            </Typography>
          </Box>
          
          {/* Show state and district if available */}
          {(item.state || item.district) && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                  opacity: 0.7
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#888888"/>
                </svg>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#666',
                  fontSize: '0.8rem',
                }}
              >
                {[capitalizeFirstLetter(item.state), capitalizeFirstLetter(item.district)].filter(Boolean).join(', ')}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };
  
  // Category tab component
  const CategoryTab = ({ name, count }) => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#000',
        color: 'white',
        p: 2,
        borderRadius: 2,
        mb: 2,
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.9
        }
      }}
    >
      <Typography fontWeight="medium">{name}</Typography>
      <Box 
        sx={{ 
          backgroundColor: 'white', 
          color: 'black', 
          width: 30, 
          height: 30, 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}
      >
        {count}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
      {/* National News Header */}
      <Box 
        sx={{ 
          width: '100%', 
          position: 'relative',
          py: 5,
          color: 'white',
          textAlign: 'center',
          mb: 8,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #FF9933 0%, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%, #138808 100%)',
            opacity: 0.9,
            zIndex: 0
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(25, 118, 210, 0.3)',
            backdropFilter: 'blur(2px)',
            zIndex: 1
          }
        }}
      >
        {/* Ashoka Chakra */}
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ashoka_Chakra.svg/1024px-Ashoka_Chakra.svg.png")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            zIndex: 2,
            opacity: 0.9
          }}
        />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3, pt: 0.5 }}>
          <Box sx={{ 
            display: 'inline-block',
            px: 5, 
            py: 1.5, 
            borderRadius: 2,
            position: 'relative',
            top: -30,
          }}>
            <Typography 
              color='black' 
              variant="h3" 
              component="h1" 
              fontWeight="bold" 
              sx={{ 
                mb: 0, 
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              National News
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading national news...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ 
            p: 3, 
            backgroundColor: '#FFF5F5', 
            borderRadius: 2, 
            color: '#E53E3E',
            textAlign: 'center',
            mb: 4
          }}>
            <Typography variant="h6">{error}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please try again later or check your connection.
            </Typography>
          </Box>
        ) : newsItems.length === 0 ? (
          <Box sx={{ 
            p: 3, 
            backgroundColor: '#F7FAFC', 
            borderRadius: 2, 
            textAlign: 'center',
            mb: 4
          }}>
            <Typography variant="h6">No national news available at the moment.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please check back later for updates.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 } }}>
            {/* Left Side - News Cards */}
            <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {/* First News Card */}
              <Box sx={{ flex: 1 }}>
                {newsItems[0] && <NewsCard item={newsItems[0]} />}
              </Box>
              
              {/* Second News Card */}
              <Box sx={{ flex: 1 }}>
                {newsItems[1] && <NewsCard item={newsItems[1]} />}
              </Box>
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
      <Container 
        sx={{ 
          maxWidth: { xs: '95%', sm: '90%', md: '1200px' }, 
          mx: 'auto',
          position: 'relative',
          mb: 8
        }}
      >
        {!loading && !error && newsItems.length > 0 && (
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
              {/* Display news items in pairs for the scrollable section */}
              {Array.from({ length: Math.ceil((newsItems.length - 2) / 2) }).map((_, idx) => {
                const firstIndex = idx * 2 + 2; // Start from index 2 since 0 and 1 are in the first section
                const secondIndex = firstIndex + 1;
                
                return (
                  <Box key={idx} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
                    <Box sx={{ flex: 1 }}>
                      {newsItems[firstIndex] && <SecondSectionNewsCard item={newsItems[firstIndex]} />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      {newsItems[secondIndex] && <SecondSectionNewsCard item={newsItems[secondIndex]} />}
                    </Box>
                  </Box>
                );
              })}
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
        )}
      </Container>
    </Box>
  );
};

export default NationalNews; 