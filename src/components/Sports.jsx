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

const Sports = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSportsNews();
  }, []);

  const fetchSportsNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://13.234.42.114:3333/api/news/category/sports');
      console.log('Sports news API response:', response.data);
      
      // Process data from API
      let fetchedNews = [];
      if (Array.isArray(response.data)) {
        fetchedNews = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        fetchedNews = response.data.data;
      }
      
      setNewsItems(fetchedNews);
    } catch (err) {
      console.error('Error fetching sports news:', err);
      setError('Failed to load sports news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Social media stats
  const socialStats = [
    { platform: 'facebook', icon: 'https://cdn.iconscout.com/icon/free/png-256/free-facebook-logo-2019-1597680-1350125.png', count: '62.8k', label: 'likes' },
    { platform: 'instagram', icon: 'https://static.vecteezy.com/system/resources/previews/017/743/717/original/instagram-icon-logo-free-png.png', count: '78.4k', label: 'followers' },
    { platform: 'twitter', icon: 'https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png', count: '85.2k', label: 'followers' },
    { platform: 'youtube', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png', count: '120k', label: 'subscribers' },
  ];

  // News card component
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
            <CardMedia
              component="img"
              height="360"
              image={mediaUrl}
              alt={item.title}
              sx={{
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image';
              }}
            />
          )}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 2,
              backgroundColor: '#2E7D32',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              padding: '6px 16px',
              borderRadius: '4px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {item.category || 'SPORTS'}
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
            {item.title || 'No title available'}
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
              {formatDate(item.createdAt || item.updatedAt || item.publishedAt)}
            </Typography>
          </Box>
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
            <CardMedia
              component="img"
              height="280"
              image={mediaUrl}
              alt={item.title}
              sx={{
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image';
              }}
            />
          )}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 2,
              backgroundColor: '#2E7D32',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              padding: '6px 16px',
              borderRadius: '4px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {item.category || 'SPORTS'}
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
            {item.title || 'No title available'}
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
              {formatDate(item.createdAt || item.updatedAt || item.publishedAt)}
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
      {/* Sports News Header */}
      <Box 
        sx={{ 
          width: '100%', 
          position: 'relative',
          py: 5,
          color: 'white',
          textAlign: 'center',
          mb: 8,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #1B5E20 0%, #388E3C 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%2343A047' fill-opacity='0.2' d='M0,0 L50,0 L50,50 L0,50 Z M50,50 L100,50 L100,100 L50,100 Z M0,50 L50,50 L50,100 L0,100 Z M50,0 L100,0 L100,50 L50,50 Z'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
            zIndex: 1,
            opacity: 0.4
          }
        }}
      >
        {/* Stadium Lines */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cline x1='50%25' y1='0' x2='50%25' y2='100%25' stroke='%23FFFFFF' stroke-width='1' stroke-opacity='0.1'/%3E%3Ccircle cx='50%25' cy='50%25' r='30' fill='none' stroke='%23FFFFFF' stroke-width='1' stroke-opacity='0.1'/%3E%3C/svg%3E")`,
            zIndex: 1
          }}
        />
        
        {/* Cricket Ball */}
        <Box 
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            backgroundColor: '#D32F2F',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '20%',
              left: '20%',
              width: '60%',
              height: '60%',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid rgba(255,255,255,0.1)',
              borderLeft: '2px solid rgba(255,255,255,0.1)',
            }
          }}
        />
        
        {/* Football */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '15%',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 2,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cpolygon points='50,15 75,30 70,60 30,60 25,30' fill='%23000000' fill-opacity='0.2'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Tennis Ball */}
        <Box 
          sx={{
            position: 'absolute',
            top: '30%',
            right: '20%',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#CDDC39',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 2,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cpath d='M0,50 C0,22.4 22.4,0 50,0 C77.6,0 100,22.4 100,50 C77.6,50 22.4,50 0,50 Z M100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C22.4,50 77.6,50 100,50 Z' fill='%23FFFFFF' fill-opacity='0.2'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Volleyball */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: '60%',
            left: '25%',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            backgroundColor: '#EEEEEE',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 2,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cpath d='M50,0 C77.6,0 100,22.4 100,50 L50,50 Z M0,50 C0,22.4 22.4,0 50,0 L50,50 Z M50,100 C22.4,100 0,77.6 0,50 L50,50 Z M100,50 C100,77.6 77.6,100 50,100 L50,50 Z' fill='%23FFB74D' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Rugby Ball */}
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            right: '8%',
            width: '45px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#795548',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 2,
            transform: 'rotate(-30deg)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '30%',
              left: '30%',
              width: '40%',
              height: '40%',
              border: '1px solid rgba(255,255,255,0.3)',
            }
          }}
        />
        
        {/* Athletics Track */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30px',
            backgroundImage: `repeating-linear-gradient(90deg, #FF5722 0px, #FF5722 50px, #F57C00 50px, #F57C00 100px)`,
            opacity: 0.3,
            zIndex: 2,
          }}
        />
        
        {/* Basketball */}
        <Box 
          sx={{
            position: 'absolute',
            top: '70%',
            left: '18%',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#FF9800',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 2,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cpath d='M50,0 L50,100 M0,50 L100,50 M15,15 L85,85 M15,85 L85,15' stroke='%23000000' stroke-width='2' stroke-opacity='0.2'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Sport Silhouettes */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '80px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='80' viewBox='0 0 1200 80'%3E%3Cpath d='M0,60 C150,40 350,30 500,50 C650,70 750,80 900,70 C1050,60 1150,40 1200,30 L1200,80 L0,80 Z' fill='%23000000' fill-opacity='0.2'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 2
          }}
        />
                
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3 }}>
          <Box sx={{ 
            display: 'inline-block',
            px: 5, 
            py: 2,
            position: 'relative',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 3,
            backdropFilter: 'blur(3px)'
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              fontWeight="bold" 
              sx={{ 
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                position: 'relative',
                display: 'inline-block'
              }}
            >
              Sports News
              <Box
                sx={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-50px',
                  backgroundColor: '#FFD600',
                  color: '#000',
                  fontSize: '0.9rem',
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  transform: 'rotate(15deg)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                LIVE
              </Box>
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Cricket · Football · Tennis · Volleyball · Rugby · Athletics · Basketball
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
            <Typography variant="h6" sx={{ ml: 2 }}>Loading sports news...</Typography>
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
            <Typography variant="h6">No sports news available at the moment.</Typography>
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
            
            {/* Right Side - Fixed Ad */}
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

export default Sports; 