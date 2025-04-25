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

const baseUrl = 'https://api.newztok.in';

// Side Ad Component
const SideAd = () => {
  const [sideAd, setSideAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSideAd = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/ads/public/web/side`);
        console.log('Side Ad API Response:', response.data);
        
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const firstAd = response.data.data[0];
          console.log('Selected Side Ad:', firstAd);
          console.log('Side Ad Redirect URL:', firstAd.redirectUrl);
          setSideAd(firstAd);
        } else {
          console.log('No side ads available');
          setError('No ads available');
        }
      } catch (err) {
        console.error('Error fetching side ad:', err);
        setError('Failed to load ad');
      } finally {
        setLoading(false);
      }
    };

    fetchSideAd();
  }, []);

  const handleAdClick = (e) => {
    if (sideAd && sideAd.redirectUrl) {
      e.preventDefault();
      console.log('Redirecting to:', sideAd.redirectUrl);
      window.open(sideAd.redirectUrl, '_blank');
    }
  };

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${baseUrl}${imageUrl}`;
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          height: 350, 
          bgcolor: '#f5f5f5', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 0,
        }}
      >
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error || !sideAd) {
    return (
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
          Ad Space Available
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      component="a"
      href={sideAd.redirectUrl || "#"}
      onClick={handleAdClick}
      sx={{ 
        width: '100%', 
        height: 350, 
        display: 'block',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 0,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <img 
        src={getFullImageUrl(sideAd.imageUrl)} 
        alt="Advertisement" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Typography 
        variant="caption" 
        sx={{ 
          position: 'absolute', 
          bottom: 5, 
          right: 10, 
          fontSize: '0.6rem',
          color: '#AAA',
          bgcolor: 'rgba(255,255,255,0.7)',
          px: 0.5,
          borderRadius: 0.5
        }}
      >
        Advertisement
      </Typography>
    </Box>
  );
};

// Banner Ad Component
const BannerAd = () => {
  const [bannerAd, setBannerAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBannerAd = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/ads/public/web/banner`);
        console.log('Banner Ad API Response:', response.data);
        
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const firstAd = response.data.data[0];
          console.log('Selected Banner Ad:', firstAd);
          console.log('Banner Ad Redirect URL:', firstAd.redirectUrl);
          setBannerAd(firstAd);
        } else {
          console.log('No banner ads available');
          setError('No ads available');
        }
      } catch (err) {
        console.error('Error fetching banner ad:', err);
        setError('Failed to load ad');
      } finally {
        setLoading(false);
      }
    };

    fetchBannerAd();
  }, []);

  const handleAdClick = (e) => {
    if (bannerAd && bannerAd.redirectUrl) {
      e.preventDefault();
      console.log('Redirecting to:', bannerAd.redirectUrl);
      window.open(bannerAd.redirectUrl, '_blank');
    }
  };

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${baseUrl}${imageUrl}`;
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          height: 100, 
          bgcolor: '#f5f5f5', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 0,
          mb: 3
        }}
      >
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error || !bannerAd) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          height: 100, 
          bgcolor: '#E0E0E0', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          borderRadius: 0,
          position: 'relative',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          mb: 3
        }}
      >
        970 x 100
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
          Ad Space Available
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      component="a"
      href={bannerAd.redirectUrl || "#"}
      onClick={handleAdClick}
      sx={{ 
        width: '100%', 
        height: 100, 
        display: 'block',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 0,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        mb: 3
      }}
    >
      <img 
        src={getFullImageUrl(bannerAd.imageUrl)} 
        alt="Advertisement" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Typography 
        variant="caption" 
        sx={{ 
          position: 'absolute', 
          bottom: 5, 
          right: 10, 
          fontSize: '0.6rem',
          color: '#AAA',
          bgcolor: 'rgba(255,255,255,0.7)',
          px: 0.5,
          borderRadius: 0.5
        }}
      >
        Advertisement
      </Typography>
    </Box>
  );
};

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
      bannerColor: '#7B1FA2' // Purple shade for Jharkhand
    },
    'bihar': {
      hindi: 'बिहार',
      endpoint: 'api/news/state/bihar',
      bannerColor: '#1565C0' // Blue shade for Bihar
    },
    'uttar-pradesh': {
      hindi: 'उत्तर प्रदेश',
      endpoint: 'api/news/state/up',
      bannerColor: '#C62828' // Red shade for Uttar Pradesh
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

    // Check if item has video content - same approach as in State.jsx
    const hasVideo = item.hasVideo || 
      item.video || 
      item.videoPath || 
      (item.featuredImage && typeof item.featuredImage === 'string' && item.featuredImage.includes('/uploads/videos/video-')) ||
      (item.image && typeof item.image === 'string' && item.image.includes('/uploads/videos/video-'));
    
    // Check if item has youtubeUrl for video content
    const isYouTubeVideo = !!item.youtubeUrl;

    const getFullImageUrl = (imagePath) => {
      if (!imagePath) return 'https://via.placeholder.com/380x350?text=No+Image';
      if (imagePath.startsWith('http')) return imagePath;
      return `${baseUrl}${imagePath}`;
    };

    // Function to get video URL if present
    const getVideoUrl = () => {
      // First, check if video property is already set
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

    // Generate appropriate location display
    const getLocationDisplay = () => {
      if (item.location) return item.location;
      
      // If no specific location, show state and district if available
      if (state === 'uttar-pradesh') {
        return item.district ? `Uttar Pradesh, ${item.district}` : 'Uttar Pradesh';
      } else if (state === 'jharkhand') {
        return item.district ? `Jharkhand, ${item.district}` : 'Jharkhand';
      } else if (state === 'bihar') {
        return item.district ? `Bihar, ${item.district}` : 'Bihar, Patna';
      }
      
      return 'Location not available';
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
            {isYouTubeVideo && youtubeEmbedUrl ? (
              <iframe
                width="100%"
                height="360"
                src={youtubeEmbedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={item.title}
              />
            ) : hasVideo && videoUrl ? (
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
                    height: '360px',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    console.error('Video failed to load:', videoUrl);
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </Box>
            ) : (
              <CardMedia
                component="img"
                height="360"
                image={getFullImageUrl(item.image || item.featuredImage)}
                alt={item.title || ''}
                sx={{ objectFit: 'cover' }}
              />
            )}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: hasVideo ? '#E53E3E' : stateConfig[state]?.bannerColor || '#1B5E20',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
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
              {item.category || 'STATE'}
              {hasVideo && ' VIDEO'}
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
                '&:hover': { color: stateConfig[state]?.bannerColor || '#1B5E20' }
              }}
            >
              {item.title || 'No Title'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888' }}>
              <LocationOnIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ color: '#888' }}>
                {getLocationDisplay()}
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
          py: 8,
          color: 'white',
          textAlign: 'center',
          mb: 8,
          overflow: 'hidden',
          background: `linear-gradient(180deg, ${currentState?.bannerColor || '#1B5E20'} 0%, ${currentState?.bannerColor ? currentState.bannerColor + '99' : '#2E7D32'} 100%)`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: state === 'uttar-pradesh' ?
              // UP pattern - temple/gate silhouettes
              `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFFFFF' fill-opacity='0.15' d='M10,90 L10,60 L20,60 L20,70 L30,70 L30,60 L40,60 L40,70 L50,70 L50,60 L60,60 L60,70 L70,70 L70,60 L80,60 L80,90 L10,90 Z M20,60 L20,50 L30,40 L40,50 L40,60 L20,60 Z M60,60 L60,50 L70,40 L80,50 L80,60 L60,60 Z'/%3E%3C/svg%3E")` :
            state === 'jharkhand' ?
              // Jharkhand pattern - tribal art inspired
              `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFFFFF' fill-opacity='0.15' d='M10,10 L20,20 L30,10 L40,20 L50,10 L60,20 L70,10 L80,20 L90,10 L90,30 L80,40 L90,50 L80,60 L90,70 L80,80 L90,90 L70,90 L60,80 L50,90 L40,80 L30,90 L20,80 L10,90 L10,70 L20,60 L10,50 L20,40 L10,30 L10,10 Z'/%3E%3C/svg%3E")` :
              // Bihar pattern - river/waves
              `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 200 100'%3E%3Cpath fill='%23FFFFFF' fill-opacity='0.15' d='M0,20 C40,10 60,30 100,20 C140,10 160,30 200,20 L200,30 C160,40 140,20 100,30 C60,40 40,20 0,30 L0,20 Z M0,50 C40,40 60,60 100,50 C140,40 160,60 200,50 L200,60 C160,70 140,50 100,60 C60,70 40,50 0,60 L0,50 Z M0,80 C40,70 60,90 100,80 C140,70 160,90 200,80 L200,90 C160,100 140,80 100,90 C60,100 40,80 0,90 L0,80 Z'/%3E%3C/svg%3E")`,
            backgroundSize: state === 'bihar' ? '200px 100px' : '100px 100px',
            backgroundPosition: 'center',
            zIndex: 1,
            opacity: 0.7,
            animation: 'backgroundScroll 30s linear infinite'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: state === 'uttar-pradesh' ?
              'radial-gradient(circle at 30% 50%, rgba(198, 40, 40, 0.4) 0%, rgba(198, 40, 40, 0) 60%)' :
            state === 'jharkhand' ?
              'radial-gradient(circle at 70% 50%, rgba(123, 31, 162, 0.4) 0%, rgba(123, 31, 162, 0) 60%)' :
              'radial-gradient(circle at 50% 50%, rgba(21, 101, 192, 0.4) 0%, rgba(21, 101, 192, 0) 60%)',
            zIndex: 0
          },
          '@keyframes backgroundScroll': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: state === 'bihar' ? '200px 0' : '100px 0' }
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
              px: 6, 
              py: 3,
              position: 'relative',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 4,
              backdropFilter: 'blur(4px)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  mb: 1.5,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '1px'
                }}
              >
                {state === 'uttar-pradesh' ? 'UTTAR PRADESH' : 
                 state === 'jharkhand' ? 'JHARKHAND' : 
                 state === 'bihar' ? 'BIHAR' : 
                 state?.replace('-', ' ')?.toUpperCase() || 'State'}
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  opacity: 0.95,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}
              >
                News from {state === 'uttar-pradesh' ? 'Uttar Pradesh' : 
                           state === 'jharkhand' ? 'Jharkhand' : 
                           state === 'bihar' ? 'Bihar' : 
                           state?.replace('-', ' ')} / {currentState?.hindi || ''}
              </Typography>
              {/* Small accent decoration */}
              <Box sx={{
                position: 'absolute',
                width: '60px',
                height: '3px',
                backgroundColor: 'white',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '3px'
              }} />
            </Box>
          </Box>
        </Container>
        
        {/* Decorative elements for each state */}
        {state === 'uttar-pradesh' && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '25px',
            background: 'rgba(255,255,255,0.1)',
            clipPath: 'polygon(0% 0%, 4% 100%, 8% 0%, 12% 100%, 16% 0%, 20% 100%, 24% 0%, 28% 100%, 32% 0%, 36% 100%, 40% 0%, 44% 100%, 48% 0%, 52% 100%, 56% 0%, 60% 100%, 64% 0%, 68% 100%, 72% 0%, 76% 100%, 80% 0%, 84% 100%, 88% 0%, 92% 100%, 96% 0%, 100% 100%, 100% 100%, 0% 100%)'
          }} />
        )}
        {state === 'jharkhand' && (
          <Box sx={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            width: '70px',
            height: '70px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)'
            }
          }} />
        )}
        {state === 'bihar' && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '10px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)'
          }} />
        )}
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
              <SideAd />
              
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

      {/* Banner Ad after first section */}
      <Container 
        sx={{ 
          maxWidth: { xs: '95%', sm: '90%', md: '1200px' }, 
          mx: 'auto',
          mb: 5
        }}
      >
        <BannerAd />
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
              <SideAd />
              
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
                      bgcolor: currentState?.bannerColor || '#1B5E20',
                      color: 'white',
                      py: 1.5,
                      borderRadius: 2,
                      justifyContent: 'space-between',
                      '&:hover': { 
                        bgcolor: currentState?.bannerColor ? 
                          currentState.bannerColor + 'CC' : 
                          '#2E7D32'  
                      }
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

      {/* Banner Ad at bottom */}
      <Container 
        sx={{ 
          maxWidth: { xs: '95%', sm: '90%', md: '1200px' }, 
          mx: 'auto',
          mb: 8
        }}
      >
        <BannerAd />
      </Container>
    </Box>
  );
};

export default StateNewsPage; 