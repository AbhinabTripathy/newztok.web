import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Link, Stack, Chip, CircularProgress } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import axios from 'axios';

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
    { name: 'State', count: 0, endpoint: 'district' }
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

          {/* Categories Section */}
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