import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Link, Stack, Chip, CircularProgress } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import axios from 'axios';
import QRCode from '../assets/images/newztok_qr.jpg';

const Footer = () => {
  const [loading, setLoading] = useState({
    national: true,
    trending: true,
    categories: true
  });
  
  const [recentNationalNews, setRecentNationalNews] = useState([]);
  const [recentTrendingNews, setRecentTrendingNews] = useState([]);
  const [categories, setCategories] = useState([
    { name: 'International', count: 0, endpoint: 'international' },
    { name: 'National', count: 0, endpoint: 'national' },
    { name: 'Sports', count: 0, endpoint: 'sports' },
    { name: 'Entertainment', count: 0, endpoint: 'entertainment' },
    { name: 'State', count: 0, endpoint: 'state' }
  ]);
  
  const baseUrl = 'https://api.newztok.in/api/news';

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return dateString;
    }
  };

  // Fetch recent national news
  useEffect(() => {
    const fetchRecentNationalNews = async () => {
      setLoading(prev => ({ ...prev, national: true }));
      try {
        const response = await axios.get(`${baseUrl}/category/national`);
        let newsData = [];
        
        if (response.data && Array.isArray(response.data.data)) {
          newsData = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          newsData = response.data;
        }
        
        // Get most recent news item
        if (newsData.length > 0) {
          setRecentNationalNews(newsData[0]);
        }
      } catch (error) {
        console.error('Error fetching national news:', error);
      } finally {
        setLoading(prev => ({ ...prev, national: false }));
      }
    };
    
    fetchRecentNationalNews();
  }, []);

  // Fetch recent trending news
  useEffect(() => {
    const fetchRecentTrendingNews = async () => {
      setLoading(prev => ({ ...prev, trending: true }));
      try {
        const response = await axios.get(`${baseUrl}/trending`);
        let newsData = [];
        
        if (response.data && Array.isArray(response.data.data)) {
          newsData = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          newsData = response.data;
        }
        
        // Get most recent trending news item
        if (newsData.length > 0) {
          setRecentTrendingNews(newsData[0]);
        }
      } catch (error) {
        console.error('Error fetching trending news:', error);
      } finally {
        setLoading(prev => ({ ...prev, trending: false }));
      }
    };
    
    fetchRecentTrendingNews();
  }, []);

  // Fetch category counts
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      setLoading(prev => ({ ...prev, categories: true }));
      
      try {
        const updatedCategories = [...categories];
        
        // Fetch count for each category
        for (let i = 0; i < updatedCategories.length; i++) {
          const category = updatedCategories[i];
          try {
            // Special handling for state category
            if (category.endpoint === 'state') {
              // Define states to fetch
              const states = ['up', 'bihar', 'jharkhand'];
              let totalStateCount = 0;
              
              // Fetch news for each state and add to total count
              for (const state of states) {
                const stateResponse = await axios.get(`${baseUrl}/state/${state}`);
                let stateNewsData = [];
                
                if (stateResponse.data && Array.isArray(stateResponse.data.data)) {
                  stateNewsData = stateResponse.data.data;
                } else if (stateResponse.data && Array.isArray(stateResponse.data)) {
                  stateNewsData = stateResponse.data;
                }
                
                totalStateCount += stateNewsData.length;
              }
              
              updatedCategories[i] = {
                ...category,
                count: totalStateCount
              };
            } else {
              // Regular category handling (unchanged)
              const response = await axios.get(`${baseUrl}/category/${category.endpoint}`);
              let newsData = [];
              
              if (response.data && Array.isArray(response.data.data)) {
                newsData = response.data.data;
              } else if (response.data && Array.isArray(response.data)) {
                newsData = response.data;
              }
              
              updatedCategories[i] = {
                ...category,
                count: newsData.length
              };
            }
          } catch (error) {
            console.error(`Error fetching ${category.name} count:`, error);
          }
        }
        
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };
    
    fetchCategoryCounts();
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'black',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* About Us Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ color: '#888888', mb: 4 }}>
              Your source for the latest news and updates.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link 
                href="https://www.linkedin.com/company/newztok/"
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: '#0077B5',
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LinkedInIcon />
              </Link>
              <Link 
                href="https://www.youtube.com/channel/UCn3IbwYbzMqebVC7AHlRD3A"
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: '#FF0000',
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <YouTubeIcon />
              </Link>
              <Link 
                href="https://www.instagram.com/newztok.news?utm_source=qr&igsh=MW5hOGlyZW0yZDhmaA=="
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: '#E4405F',
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <InstagramIcon />
              </Link>
              <Link 
                href="https://www.facebook.com/share/16BJSMtSn1/"
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: '#1877F2',
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FacebookIcon />
              </Link>
              <Link 
                href="https://whatsapp.com/channel/0029VbA2TzqG8l5AxszzsJ0E"
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: '#25D366',
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <WhatsAppIcon />
              </Link>
              <Link 
                href="https://x.com/newztok_news?t=bE27w5SMkv5Hdpu9TJPCJQ&s=09"
                color="inherit"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: '#000000',
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                }}
              >
                <Typography 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem',
                    color: 'white',
                    lineHeight: 1
                  }}
                >
                  X
                </Typography>
              </Link>
            </Stack>
          </Grid>

          {/* Recent Posts Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
              Recent Posts
            </Typography>
            <Box>
              <Typography variant="body2" color="primary.main" sx={{ mb: 2 }}>
                NATIONAL
              </Typography>
              {loading.national ? (
                <CircularProgress size={20} sx={{ color: 'gray', my: 2 }} />
              ) : recentNationalNews && Object.keys(recentNationalNews).length > 0 ? (
                <>
                  <Link 
                    href="/national" 
                    color="inherit" 
                    underline="hover" 
                    sx={{ display: 'block', mb: 2 }}
                  >
                    {recentNationalNews.title}
                  </Link>
                  <Typography variant="caption" sx={{ color: '#888888' }}>
                    {formatDate(recentNationalNews.createdAt)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" sx={{ color: '#888888' }}>
                  No recent national news available
                </Typography>
              )}

              <Typography variant="body2" color="primary.main" sx={{ mb: 2, mt: 4 }}>
                TRENDING
              </Typography>
              {loading.trending ? (
                <CircularProgress size={20} sx={{ color: 'gray', my: 2 }} />
              ) : recentTrendingNews && Object.keys(recentTrendingNews).length > 0 ? (
                <>
                  <Link 
                    href="/trending" 
                    color="inherit" 
                    underline="hover" 
                    sx={{ display: 'block', mb: 2 }}
                  >
                    {recentTrendingNews.title}
                  </Link>
                  <Typography variant="caption" sx={{ color: '#888888' }}>
                    {formatDate(recentTrendingNews.createdAt)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" sx={{ color: '#888888' }}>
                  No recent trending news available
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Categories Section - Moved next to Recent Posts */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
              Categories
            </Typography>
            {loading.categories ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress size={24} sx={{ color: 'gray' }} />
              </Box>
            ) : (
              <Stack spacing={1}>
                {categories.map((category) => (
                  <Box
                    key={category.name}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      pb: 1
                    }}
                  >
                    <Link href={`/${category.endpoint.toLowerCase()}`} color="inherit" underline="hover">
                      {category.name}
                    </Link>
                    <Chip
                      label={category.count}
                      size="small"
                      sx={{
                        bgcolor: '#C4242B',
                        color: 'white',
                        borderRadius: '12px',
                        minWidth: '30px'
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Grid>

          {/* App Available Section */}
          <Grid item xs={12} md={4} sx={{ ml: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
              Download Our App
            </Typography>
            <Box sx={{ 
              bgcolor: 'rgba(255,255,255,0.05)', 
              p: 3, 
              borderRadius: 2,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
                App is Available Now at the PlayStore
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Link 
                  href="https://play.google.com/store/apps/details?id=com.newztok"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    bgcolor: '#414141',
                    color: '#fff',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textDecoration: 'none',
                    '&:hover': {
                      bgcolor: '#4a4a4a'
                    }
                  }}
                >
                  <Box
                    component="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      mr: 1,
                      color: '#fff'
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"
                    />
                  </Box>
                  <Typography sx={{ 
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}>
                    Get it on Play Store
                  </Typography>
                </Link>
                <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>OR</Typography>
                <Box
                  component="img"
                  src={QRCode}
                  alt="NewzTok QR Code"
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 1,
                    border: '2px solid rgba(255,255,255,0.1)'
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box
          sx={{
            mt: 8,
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ color: '#888888' }}>
            © Copyright 2025 Newztok. All Rights Reserved Powered by Newztok Media Pvt Ltd
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="#" color="inherit" underline="hover" sx={{ color: '#888888' }}>About Us</Link>
            <Link href="#" color="inherit" underline="hover" sx={{ color: '#888888' }}>Private policy</Link>
            <Link href="#" color="inherit" underline="hover" sx={{ color: '#888888' }}>Forums</Link>
            <Link href="#" color="inherit" underline="hover" sx={{ color: '#888888' }}>Community</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 