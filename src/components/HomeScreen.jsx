import React, { useState, useEffect } from 'react';
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
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { useStateContext } from './Header'; // Import state context

const HomeScreen = () => {
  // State variables for each news section
  const [trendingNews, setTrendingNews] = useState([]);
  const [nationalNews, setNationalNews] = useState([]);
  const [internationalNews, setInternationalNews] = useState([]);
  const [sportsNews, setSportsNews] = useState([]);
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [stateNews, setStateNews] = useState([]);
  const { selectedState } = useStateContext(); // Get selected state from context
  
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

  // Social media stats exactly as in the image
  const socialMedia = [
    { icon: <FacebookIcon sx={{ fontSize: 28, color: '#4267B2' }} />, count: '20.5k', label: 'likes' },
    { icon: <InstagramIcon sx={{ fontSize: 28, color: '#C13584' }} />, count: '20.5k', label: 'followers' },
    { icon: <TwitterIcon sx={{ fontSize: 28, color: '#1DA1F2' }} />, count: '20.5k', label: 'followers' },
    { icon: <YouTubeIcon sx={{ fontSize: 28, color: '#FF0000' }} />, count: '20.5k', label: 'subscribers' },
  ];

  // Category tabs data
  const categoryTabs = [
    { name: 'Active', count: '11' },
    { name: 'Business', count: '10' },
    { name: 'Crazy', count: '5' },
  ];

  // Base URL for API
  const baseUrl = 'https://newztok.in';

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

  // Helper function to process API response and filter by selected state
  const processApiResponse = (response, category) => {
    let news = [];
    
    if (response.data && Array.isArray(response.data)) {
      news = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      news = response.data.data;
    } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
      news = response.data.posts;
    }
    
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
      const response = await axios.get(`${baseUrl}/api/news/trending`);
      const news = processApiResponse(response, 'trending');
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
      const news = processApiResponse(response, 'national');
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
      const news = processApiResponse(response, 'international');
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
      const news = processApiResponse(response, 'sports');
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
      const news = processApiResponse(response, 'entertainment');
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
    setLoading(prev => ({ ...prev, state: true }));
    setError(prev => ({ ...prev, state: null }));
    
    try {
      console.log('Fetching state news...');
      const response = await axios.get(`${baseUrl}/api/news/category/district`);
      const news = processApiResponse(response, 'state');
      console.log('State news:', news);
      setStateNews(news);
    } catch (err) {
      console.error('Error fetching state news:', err);
      setError(prev => ({ 
        ...prev, 
        state: err.response?.data?.message || err.message || 'Failed to fetch state news' 
      }));
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

  // Get image URL with proper handling
  const getImageUrl = (item) => {
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

  // News card component (single card with specific styling)
  const NewsCard = ({ item, categoryLabel, categoryColor = '#FF5722', isLarge = false }) => {
    const [imageError, setImageError] = useState(false);
    
    if (!item) return null;
    
    const handleImageError = () => {
      setImageError(true);
    };
    
    const imageUrl = getImageUrl(item);
    const title = item.title || "No Title";
    const category = categoryLabel || item.category || "NEWS";
    const time = formatDate(item.createdAt || item.publishedAt || item.updatedAt);
    
    return (
      <Box
        component={Link}
        to={`/news/${item.id}`}
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
        {/* Background image */}
        {!imageError ? (
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
          }}
        >
          <Box
            sx={{
              backgroundColor: categoryColor,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              padding: '4px 12px',
              borderRadius: '4px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {category}
          </Box>
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

  // 970 x 100 Advertisement component
  const LargeAd = () => (
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
        Powered by HTML.COM
      </Typography>
    </Box>
  );

  // 380 x 350 Advertisement component
  const SideAd = () => (
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
  );

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
            pl: 2,
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
              
              {/* Category Tabs */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {categoryTabs.map((tab, index) => (
                  <CategoryTab key={index} name={tab.name} count={tab.count} />
                ))}
              </Box>
            </Box>
          </Box>
        )}

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
            
            {/* Right Side - Social Media and Recent Posts */}
            <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Social Media Stats Box */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  border: '1px solid #eee',
                  borderRadius: 1,
                  overflow: 'hidden',
                  mb: 3,
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                {socialMedia.map((item, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      width: '50%', 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: index % 2 === 0 ? '1px solid #eee' : 'none',
                      borderBottom: index < 2 ? '1px solid #eee' : 'none',
                    }}
                  >
                    {item.icon}
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', mt: 1 }}>
                      {item.count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

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

        {/* Final Advertisement */}
        <LargeAd />
      </Container>
    </Box>
  );
};

export default HomeScreen; 