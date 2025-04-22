import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
  Stack,
  Button,
  Link,
  Divider,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const StateNewsPage = () => {
  const { state } = useParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map state names to their Hindi names and endpoints
  const stateConfig = {
    'jharkhand': {
      hindi: 'झारखंड',
      endpoint: 'api/news/state/jharkhand',
      bannerColor: '#1B5E20'
    },
    'bihar': {
      hindi: 'बिहार',
      endpoint: 'api/news/state/bihar',
      bannerColor: '#1B5E20'
    },
    'uttar-pradesh': {
      hindi: 'उत्तर प्रदेश',
      endpoint: 'api/news/state/up',
      bannerColor: '#1B5E20'
    }
  };

  useEffect(() => {
    const fetchStateNews = async () => {
      if (!state) return;
      
      setLoading(true);
      setNews(Array(6).fill({}));

      try {
        const stateInfo = stateConfig[state];
        if (!stateInfo) {
          throw new Error('Invalid state');
        }

        const response = await axios.get(`https://api.newztok.in/${stateInfo.endpoint}`);

        let newsData = [];
        if (Array.isArray(response.data)) {
          newsData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          newsData = response.data.data;
        }

        if (newsData.length === 0) {
          setError('No news available for this state');
        } else {
          setNews(newsData);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStateNews();
  }, [state]);

  const LoadingSkeleton = () => (
    <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <CardContent>
        <Skeleton variant="text" height={32} width="80%" animation="wave" />
        <Skeleton variant="text" height={20} animation="wave" />
        <Skeleton variant="text" height={20} width="60%" animation="wave" />
      </CardContent>
    </Card>
  );

  // Social media stats
  const socialStats = [
    { platform: 'facebook', icon: FacebookIcon, count: '32.8k', label: 'Fans', color: '#3b5998' },
    { platform: 'instagram', icon: InstagramIcon, count: '24.5k', label: 'Followers', color: '#E1306C' },
    { platform: 'twitter', icon: TwitterIcon, count: '18.2k', label: 'Followers', color: '#1DA1F2' },
    { platform: 'youtube', icon: YouTubeIcon, count: '45.7k', label: 'Subscribers', color: '#FF0000' }
  ];

  const NewsCard = ({ item, isLoading }) => {
    if (isLoading) return <LoadingSkeleton />;

    const getFullImageUrl = (imagePath) => {
      if (!imagePath) return 'https://via.placeholder.com/380x350?text=No+Image';
      if (imagePath.startsWith('http')) return imagePath;
      return `https://api.newztok.in${imagePath}`;
    };

    return (
      <Link 
        to={`/state/${state}/${item.id || item._id}`} 
        style={{ textDecoration: 'none' }}
      >
        <Box sx={{ position: 'relative', height: '100%', mb: 2 }}>
          <Card sx={{ 
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
          }}>
            <CardMedia
              component="img"
              height="360"
              image={getFullImageUrl(item.image || item.featuredImage)}
              alt={item.title || ''}
              sx={{ objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: '#1B5E20',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {item.category || 'STATE'}
            </Box>
          </Card>
          
          <Box sx={{ pt: 2 }}>
            <Typography
              variant="h6"
              sx={{
                color: 'black',
                fontWeight: 700,
                mb: 1,
                lineHeight: 1.3,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#1B5E20' }
              }}
            >
              {item.title || 'No Title'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888' }}>
              <LocationOnIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ color: '#888' }}>
                {item.location || 'Bihar, patna'}
              </Typography>
              <FiberManualRecordIcon sx={{ fontSize: 6, mx: 0.5 }} />
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ color: '#888' }}>
                {item.date || 'April 21, 2025 at 11:03 AM'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Link>
    );
  };

  const currentState = stateConfig[state];

  // Categories with counts
  const categories = [
    { name: 'Politics', count: 24 },
    { name: 'Development', count: 22 },
    { name: 'Culture', count: 18 }
  ];

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
      {/* State Banner */}
      <Box 
        sx={{ 
          width: '100%',
          position: 'relative',
          py: 5,
          color: 'white',
          textAlign: 'center',
          mb: 8,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #1B5E20 0%, #2E7D32 100%)',
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
        <Container maxWidth="xl">
          <Box sx={{ 
            position: 'relative', 
            zIndex: 2,
            textAlign: 'center'
          }}>
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
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {state?.replace('-', ' ')?.toUpperCase() || 'State'}
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  opacity: 0.9,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                News from {state?.replace('-', ' ')?.toUpperCase() || 'State'} / बिहार
              </Typography>
            </Box>
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
            <Typography variant="h6" sx={{ ml: 2 }}>Loading state news...</Typography>
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
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 } }}>
            {/* Left Side - News Cards */}
            <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {/* First News Card */}
              <Box sx={{ flex: 1 }}>
                {news[0] && <NewsCard item={news[0]} isLoading={loading} />}
              </Box>
              
              {/* Second News Card */}
              <Box sx={{ flex: 1 }}>
                {news[1] && <NewsCard item={news[1]} isLoading={loading} />}
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
                      <stat.icon sx={{ color: stat.color, fontSize: '2rem' }} />
                      <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 0 }}>
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
        {!loading && !error && news.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 } }}>
            {/* Left Side - Scrollable News Cards */}
            <Box 
              sx={{ 
                flex: 7, 
                maxHeight: { md: '1200px' },
                overflowY: { md: 'auto' },
                pr: { md: 2 },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                }
              }}
            >
              {/* Display news items in pairs for the scrollable section */}
              {Array.from({ length: Math.ceil((news.length - 2) / 2) }).map((_, idx) => {
                const firstIndex = idx * 2 + 2; // Start from index 2 since 0 and 1 are in the first section
                const secondIndex = firstIndex + 1;
                
                return (
                  <Box key={idx} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
                    <Box sx={{ flex: 1 }}>
                      {news[firstIndex] && <NewsCard item={news[firstIndex]} isLoading={loading} />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      {news[secondIndex] && <NewsCard item={news[secondIndex]} isLoading={loading} />}
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

              {/* Categories */}
              <Stack spacing={2}>
                {['Politics', 'Development', 'Culture'].map((category, index) => (
                  <Button
                    key={index}
                    fullWidth
                    sx={{
                      bgcolor: '#1B5E20',
                      color: 'white',
                      py: 1.5,
                      borderRadius: 2,
                      justifyContent: 'space-between',
                      '&:hover': { bgcolor: '#2E7D32' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category}
                      <Box component="span" sx={{ ml: 1, bgcolor: 'rgba(255,255,255,0.2)', px: 1, borderRadius: 1 }}>
                        {24 - index * 3}
                      </Box>
                    </Box>
                    <ArrowForwardIcon />
                  </Button>
                ))}
              </Stack>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default StateNewsPage; 