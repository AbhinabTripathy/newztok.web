import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { useStateContext } from './Header'; // Import state context

const StateNews = () => {
  const { state, district } = useParams();
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedState } = useStateContext(); // Get selected state from context
  const navigate = useNavigate(); // Add useNavigate import

  useEffect(() => {
    // Simply stop loading to show maintenance message
    setLoading(false);
    // No alert dialog or automatic redirect
  }, []);

  const fetchDistrictNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.newztok.in/api/news/category/district');
      console.log('District news API response:', response.data);
      
      // Process data from API
      let fetchedNews = [];
      if (Array.isArray(response.data)) {
        fetchedNews = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        fetchedNews = response.data.data;
      }
      
      // Filter news by selected state if one is selected
      if (selectedState) {
        console.log(`Filtering district news by state: ${selectedState}`);
        
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
          console.log(`Found ${filteredNews.length} district news items for state: ${selectedState}`);
          fetchedNews = filteredNews;
        } else {
          console.log(`No district news items found for state: ${selectedState}, showing all district news`);
        }
      }
      
      setNewsItems(fetchedNews);
    } catch (err) {
      console.error('Error fetching district news:', err);
      setError('Failed to load district news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const states = [
    {
      en: 'Bihar',
      hi: 'बिहार',
      districts: [
        { en: 'Patna', hi: 'पटना' },
        { en: 'Gaya', hi: 'गया' },
        { en: 'Muzaffarpur', hi: 'मुजफ्फरपुर' }
      ]
    },
    {
      en: 'Jharkhand',
      hi: 'झारखंड',
      districts: [
        { en: 'Ranchi', hi: 'राँची' },
        { en: 'Dhanbad', hi: 'धनबाद' },
        { en: 'Jamshedpur', hi: 'जमशेदपुर' }
      ]
    },
    {
      en: 'Uttar Pradesh',
      hi: 'उत्तर प्रदेश',
      districts: [
        { en: 'Lucknow', hi: 'लखनऊ' },
        { en: 'Kanpur', hi: 'कानपुर' },
        { en: 'Varanasi', hi: 'वाराणसी' }
      ]
    }
  ];

  // Social media stats
  const socialStats = [
    { platform: 'facebook', icon: 'https://cdn.iconscout.com/icon/free/png-256/free-facebook-logo-2019-1597680-1350125.png', count: '32.8k', label: 'likes' },
    { platform: 'instagram', icon: 'https://static.vecteezy.com/system/resources/previews/017/743/717/original/instagram-icon-logo-free-png.png', count: '24.5k', label: 'followers' },
    { platform: 'twitter', icon: 'https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png', count: '18.2k', label: 'followers' },
    { platform: 'youtube', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png', count: '45.7k', label: 'subscribers' },
  ];

  // Category tabs data
  const categoryTabs = [
    { name: 'Politics', count: '28' },
    { name: 'Development', count: '22' },
    { name: 'Culture', count: '15' },
  ];

  // News card component
  const NewsCard = ({ item }) => {
    // Check if item has youtubeUrl for video content
    const isVideo = item.youtubeUrl || item.contentType === 'video';
    
    // Add base URL to image path if it's a relative path
    const getFullImageUrl = (imagePath) => {
      if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
      if (imagePath.startsWith('http')) return imagePath;
      return `https://api.newztok.in${imagePath}`;
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
        <Link 
          to={`/state/${item.state ? item.state.toLowerCase() : 'all'}/${item.id}`}
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
                backgroundColor: '#673AB7',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                padding: '6px 16px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {item.category || 'STATE'}
            </Box>
          </Card>
        </Link>
        
        <Box sx={{ pt: 2 }}>
          <Link 
            to={`/state/${item.state ? item.state.toLowerCase() : 'all'}/${item.id}`}
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
                  color: '#3f51b5' 
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
                {[item.state, item.district].filter(Boolean).join(', ')}
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
      return `https://api.newztok.in${imagePath}`;
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
        <Link 
          to={`/state/${item.state ? item.state.toLowerCase() : 'all'}/${item.id}`}
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
                backgroundColor: '#673AB7',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                padding: '6px 16px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {item.category || 'STATE'}
            </Box>
          </Card>
        </Link>
        
        <Box sx={{ pt: 2 }}>
          <Link 
            to={`/state/${item.state ? item.state.toLowerCase() : 'all'}/${item.id}`}
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
                  color: '#3f51b5' 
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
                {[item.state, item.district].filter(Boolean).join(', ')}
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
        backgroundColor: '#673AB7',
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
          color: '#673AB7', 
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

  // Render the main content for a particular state
  const renderStateContent = (stateName, districtName = null) => {
    const stateData = states.find(s => s.en.toLowerCase() === stateName.toLowerCase());
    
    // Add null check to prevent accessing properties on undefined
    if (!stateData) {
      console.error(`State not found: ${stateName}`);
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            State information not found
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            The requested state "{stateName}" could not be found in our database.
          </Typography>
        </Box>
      );
    }
    
    const districtData = districtName ? 
      stateData.districts.find(d => d.en.toLowerCase() === districtName.toLowerCase()) :
      null;
    
    const subtitle = districtData ? 
      `News from ${stateData.en} - ${districtData.en} / ${stateData.hi} - ${districtData.hi}` :
      `News from ${stateData.en} / ${stateData.hi}`;
      
    // Custom styling for each state
    let stateStyles = {};
    let stateIcons = {};
    
    // Define state-specific styles
    if (stateData?.en === 'Bihar') {
      stateStyles = {
        background: 'linear-gradient(135deg, #2E7D32 0%, #388E3C 50%, #43A047 100%)',
        symbols: [
          // Mahabodhi Temple
          <Box 
            key="mahabodhi"
            sx={{
              position: 'absolute',
              bottom: '20%',
              right: '15%',
              width: '60px',
              height: '60px',
              opacity: 0.6,
              zIndex: 3
            }}
          >
            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5L45 20H55L50 5Z" fill="white" />
              <rect x="47" y="20" width="6" height="30" fill="white" />
              <path d="M30 50H70V110H30V50Z" fill="white" />
              <path d="M25 110H75V120H25V110Z" fill="white" />
              <path d="M35 60H45V70H35V60ZM55 60H65V70H55V60ZM35 80H45V90H35V80ZM55 80H65V90H55V80Z" fill="#388E3C" />
              <path d="M42 42C42 29.85 48.5 20 50 20C51.5 20 58 29.85 58 42H42Z" fill="white" />
            </svg>
          </Box>,
          // Lotus (Bihar state flower)
          <Box 
            key="lotus"
            sx={{
              position: 'absolute',
              top: '20%',
              left: '15%',
              width: '50px',
              height: '50px',
              opacity: 0.5,
              zIndex: 3
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 20C45 30 40 40 35 42C30 44 25 44 25 50C25 56 30 56 35 58C40 60 45 70 50 80C55 70 60 60 65 58C70 56 75 56 75 50C75 44 70 44 65 42C60 40 55 30 50 20Z" fill="white" fillOpacity="0.8" />
              <circle cx="50" cy="50" r="8" fill="#388E3C" />
            </svg>
          </Box>,
          // Ganga River 
          <Box 
            key="ganga"
            sx={{
              position: 'absolute',
              bottom: '10%',
              left: 0,
              right: 0,
              height: '20px',
              opacity: 0.3,
              zIndex: 3
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 800 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25C100 5 150 45 250 25C350 5 400 45 500 25C600 5 650 45 750 25C850 5 900 45 1000 25" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <path d="M0 35C100 15 150 55 250 35C350 15 400 55 500 35C600 15 650 55 750 35C850 15 900 55 1000 35" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Box>
        ],
        pattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 50C25 25 37.5 12.5 50 12.5C62.5 12.5 75 25 75 50C75 75 62.5 87.5 50 87.5C37.5 87.5 25 75 25 50Z' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='5' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E")`
      };
    } 
    else if (stateData?.en === 'Jharkhand') {
      stateStyles = {
        background: 'linear-gradient(135deg, #BF360C 0%, #D84315 50%, #E64A19 100%)',
        symbols: [
          // Tribal Art
          <Box 
            key="tribal-art"
            sx={{
              position: 'absolute',
              top: '30%',
              left: '15%',
              width: '100px',
              height: '80px',
              opacity: 0.5,
              zIndex: 3
            }}
          >
            <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 10C50 30 40 40 30 40C20 40 10 30 10 20M60 10C70 30 80 40 90 40C100 40 110 30 110 20" stroke="white" strokeWidth="2" />
              <path d="M60 30C55 40 50 45 40 45C30 45 20 40 15 30M60 30C65 40 70 45 80 45C90 45 100 40 105 30" stroke="white" strokeWidth="2" />
              <circle cx="60" cy="20" r="10" stroke="white" strokeWidth="2" />
              <circle cx="40" cy="60" r="5" fill="white" />
              <circle cx="80" cy="60" r="5" fill="white" />
              <path d="M20 80L40 70L60 80L80 70L100 80" stroke="white" strokeWidth="2" />
            </svg>
          </Box>,
          // Mining/Industry Icon
          <Box 
            key="mining-icon"
            sx={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              width: '60px',
              height: '60px',
              opacity: 0.5,
              zIndex: 3
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 80H80V90H20V80Z" fill="white" />
              <path d="M30 40L50 20L70 40V80H30V40Z" fill="white" />
              <path d="M40 50H60V65H40V50Z" fill="#D84315" />
              <path d="M45 20C40 35 60 35 55 20" stroke="white" strokeWidth="2" />
            </svg>
          </Box>,
          // Elephant (State Animal)
          <Box 
            key="elephant"
            sx={{
              position: 'absolute',
              bottom: '10%',
              left: '10%',
              width: '80px',
              height: '60px',
              opacity: 0.5,
              zIndex: 3
            }}
          >
            <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M90 60C90 50 100 40 110 30C100 35 90 45 90 60Z" fill="white" />
              <path d="M90 60C80 60 70 50 60 50C40 50 30 60 20 60C10 60 10 40 20 40C30 40 40 50 60 50" fill="white" />
              <path d="M60 50C60 40 65 30 70 20C75 30 80 40 80 50C80 60 70 60 60 50Z" fill="white" />
              <rect x="25" y="60" width="10" height="15" fill="white" />
              <rect x="75" y="60" width="10" height="15" fill="white" />
              <circle cx="30" cy="40" r="5" fill="white" />
            </svg>
          </Box>
        ],
        pattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10L30 30M70 30L90 10M10 90L30 70M70 70L90 90' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/svg%3E")`
      };
    } 
    else if (stateData?.en === 'Uttar Pradesh') {
      stateStyles = {
        background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 50%, #1E88E5 100%)',
        symbols: [
          // Taj Mahal
          <Box 
            key="taj-mahal"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              transform: 'translateY(-50%)',
              width: '100px',
              height: '100px',
              opacity: 0.5,
              zIndex: 3
            }}
          >
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 10L55 30H65L60 10Z" fill="white" />
              <path d="M30 90H90V100H30V90Z" fill="white" />
              <path d="M35 60C35 45 46 30 60 30C74 30 85 45 85 60V90H35V60Z" fill="white" />
              <path d="M60 30C55 45 55 60 55 90M60 30C65 45 65 60 65 90" stroke="#1976D2" strokeWidth="2" />
              <path d="M45 60A15 15 0 0 0 75 60" stroke="#1976D2" strokeWidth="2" />
              <path d="M35 70H85M35 80H85" stroke="#1976D2" strokeWidth="1" />
            </svg>
          </Box>,
          // Ganga-Jamuna Symbol
          <Box 
            key="ganga-jamuna"
            sx={{
              position: 'absolute',
              top: '20%',
              right: '15%',
              width: '70px',
              height: '70px',
              opacity: 0.5,
              zIndex: 3
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 20C30 30 30 40 20 50C10 60 10 70 20 80" stroke="white" strokeWidth="3" />
              <path d="M40 20C50 30 50 40 40 50C30 60 30 70 40 80" stroke="white" strokeWidth="3" />
              <path d="M60 20C70 30 70 40 60 50C50 60 50 70 60 80" stroke="white" strokeWidth="3" />
              <path d="M80 20C90 30 90 40 80 50C70 60 70 70 80 80" stroke="white" strokeWidth="3" />
            </svg>
          </Box>,
          // Wheat 
          <Box 
            key="wheat"
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              width: '60px',
              height: '90px',
              opacity: 0.5,
              zIndex: 3
            }}
          >
            <svg viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 10V90" stroke="white" strokeWidth="2" />
              <path d="M30 30L40 20M30 40L45 25M30 50L50 30M30 60L45 45M30 70L40 60" stroke="white" strokeWidth="2" />
              <path d="M30 30L20 20M30 40L15 25M30 50L10 30M30 60L15 45M30 70L20 60" stroke="white" strokeWidth="2" />
            </svg>
          </Box>
        ],
        pattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20H80V80H20V20Z' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3Cpath d='M30 30H70V70H30V30Z' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3Cpath d='M40 40H60V60H40V40Z' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/svg%3E")`
      };
    }
    else {
      // Default style (fallback)
      stateStyles = {
        background: 'linear-gradient(135deg, #5E35B1 0%, #673AB7 50%, #7E57C2 100%)',
        symbols: [],
        pattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18C11 11.9 15.9 7 22 7C28.1 7 33 11.9 33 18C33 24.1 28.1 29 22 29C15.9 29 11 24.1 11 18ZM65 18C65 24.1 60.1 29 54 29C47.9 29 43 24.1 43 18C43 11.9 47.9 7 54 7C60.1 7 65 11.9 65 18ZM32 63Q32 51 40 42.5Q48 34 60 34Q72 34 80 42.5Q88 51 88 63Q88 75 80 83.5Q72 92 60 92Q48 92 40 83.5Q32 75 32 63Z' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E")`
      };
    }
    
    return (
      <Box sx={{ width: '100%', backgroundColor: '#f5f5f5', mb: districtName ? 0 : 8 }}>
        {/* State Header with Thematic Design */}
      <Box
        sx={{
          width: '100%',
            position: 'relative',
            py: 4,
          color: 'white',
            textAlign: 'center',
            mb: 8,
            overflow: 'hidden',
            background: stateStyles.background || 'linear-gradient(135deg, #5E35B1 0%, #673AB7 50%, #7E57C2 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
              backgroundImage: stateStyles.pattern,
              backgroundSize: '200px 200px',
              opacity: 0.7,
              zIndex: 1
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%)',
              zIndex: 2
            }
          }}
        >
          {/* State Symbols */}
          {stateStyles.symbols && stateStyles.symbols.map((symbol, index) => symbol)}
          
          {/* Indian Map Silhouette - for all states */}
          <Box 
            sx={{ 
              position: 'absolute',
              top: '50%',
              right: '10%',
              transform: 'translateY(-50%)',
              width: '80px',
              height: '120px',
              opacity: 0.3,
              zIndex: 3,
              display: stateStyles.symbols && stateStyles.symbols.length > 0 ? 'none' : 'block'
            }}
          >
            <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M130.5,15.5c-0.5,2-3.5,2.5-4.5,4.5c-1,2-0.5,3-0.5,5.5s-7.5,3-8,5c-0.5,2-1,6-1,6s-7,2.5-8,4s-3.5,5.5-4.5,7.5s-4.5,1-6,2.5s-2,7.5-3.5,8.5s-5,1-6.5,3s-0.5,6-2,8s-5.5,1-7.5,2.5s-1.5,7-2.5,9s-5.5,1.5-7,3.5s-1,8-1,8s-7.5,5.5-8,8s1.5,7.5,0,9.5s-7.5,1.5-9,3.5s-0.5,7.5-0.5,7.5l-7,3.5c0,0-2.5,3.5-2.5,5.5s2,6.5,2,8s-3,3.5-3,5.5s0.5,7.5,0.5,7.5s-2,3-2,5s1.5,8,1.5,8s-3,6.5-3,8.5s5.5,8,5.5,8l1.5,14l-2.5,5l6,8l3.5,14.5l7.5,7.5l2.5,7.5l7,1l1,4.5c0,0,9.5,2,10.5,0s1.5-10.5,1.5-10.5l3-5l6-0.5l-0.5-4.5l7.5-1.5c0,0,2.5-4,2.5-6s-1.5-6.5-1.5-6.5l2.5-9l20.5-3.5l3-5l9.5,1l6-19c0,0,3-3.5,5.5-3.5s7.5,0.5,7.5,0.5l6-5.5c0,0,6,2,8,0s9.5-11.5,9.5-11.5s5-1,7-2.5s4.5-6.5,4.5-6.5s3.5,0,5.5-1s6-7.5,6-7.5s2.5-2,4.5-3s5-6.5,5-6.5s3-7.5,3-9.5s-1-7-1-7s2-5.5,2-7.5s-2-8-2-8s1.5-4,0-6s-7-4.5-7-4.5s0.5-5.5-1-7s-5.5-1.5-7-3s-3-7-3-7s-1-5.5-3-7s-6,0-8-1.5s-2.5-10-2.5-10s-9-0.5-11-2s-5-8-5-8l-6-4l-6-2c0,0-4.5-5-6.5-5s-5-1-7-1s-3.5-4-3.5-4L130.5,15.5z" fill="#FFF" fillOpacity="0.8"/>
            </svg>
          </Box>
          
          {/* State Boundary Lines - common to all */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 H 90 V 90 H 10 Z' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='0.5'/%3E%3Cpath d='M30 10 V 90 M 70 10 V 90 M 10 30 H 90 M 10 70 H 90' fill='none' stroke='rgba(255,255,255,0.07)' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px',
              opacity: 0.6,
              zIndex: 3
            }}
          />
          
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 4 }}>
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
                  textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                {stateData?.en} {districtData && `- ${districtData.en}`}
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
                {subtitle}
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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 } }}>
            {/* Left Side - News Cards */}
            <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              {/* First News Card */}
              <Box sx={{ flex: 1 }}>
                {newsItems.length > 0 && <NewsCard item={newsItems[0]} />}
              </Box>
              
              {/* Second News Card */}
              <Box sx={{ flex: 1 }}>
                {newsItems.length > 1 && <NewsCard item={newsItems[1]} />}
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
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
                {/* First News Card */}
                <Box sx={{ flex: 1 }}>
                  {newsItems.length > 2 && <SecondSectionNewsCard item={newsItems[2]} />}
                </Box>
                
                {/* Second News Card */}
                <Box sx={{ flex: 1 }}>
                  {newsItems.length > 3 && <SecondSectionNewsCard item={newsItems[3]} />}
                </Box>
              </Box>
              
              {/* Additional news cards that can be scrolled */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
                <Box sx={{ flex: 1 }}>
                  {newsItems.length > 4 && <SecondSectionNewsCard item={newsItems[4]} />}
                </Box>
                <Box sx={{ flex: 1 }}>
                  {newsItems.length > 5 && <SecondSectionNewsCard item={newsItems[5]} />}
                </Box>
              </Box>
              
              {/* Fourth Section - News Cards */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
                <Box sx={{ flex: 1 }}>
                  {newsItems.length > 6 && <SecondSectionNewsCard item={newsItems[6]} />}
                </Box>
                <Box sx={{ flex: 1 }}>
                  {newsItems.length > 7 && <SecondSectionNewsCard item={newsItems[7]} />}
                </Box>
              </Box>
              
              {/* Fifth Section - News Cards */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
                <Box sx={{ flex: 1 }}>
                  {newsItems.length > 8 && <SecondSectionNewsCard item={newsItems[8]} />}
                </Box>
                <Box sx={{ flex: 1 }}>
                  {newsItems.length > 9 && <SecondSectionNewsCard item={newsItems[9]} />}
                </Box>
              </Box>
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

        {/* Additional Section */}
        <Container 
            sx={{
            maxWidth: { xs: '95%', sm: '90%', md: '1200px' }, 
            mx: 'auto',
            mb: 8
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 5 }}>
            <Box sx={{ flex: 1 }}>
              {newsItems.length > 10 && <SecondSectionNewsCard item={newsItems[10]} />}
            </Box>
            <Box sx={{ flex: 1 }}>
              {newsItems.length > 11 && <SecondSectionNewsCard item={newsItems[11]} />}
            </Box>
        </Box>
        </Container>
      </Box>
  );
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading district news...</Typography>
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
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '60vh',
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            }
          }}
          onClick={() => navigate('/')}
        >
          <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
            State News Section
          </Typography>
          <Typography variant="h5" gutterBottom color="error">
            Under Maintenance
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto', color: 'text.secondary' }}>
            We're currently updating this section to serve you better.
          </Typography>
          <Box 
            sx={{
              mt: 2,
              py: 1.5,
              px: 3,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'medium',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              }
            }}
          >
            Click to Return to Home
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StateNews; 