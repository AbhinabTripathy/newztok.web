import React from 'react';
import { Box, Container, Typography, Grid, Link, Stack, Chip } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const categories = [
    { name: 'Internation', count: 11 },
    { name: 'National', count: 10 },
    { name: 'Sports', count: 5 },
    { name: 'Uttar Pradesh', count: 10 },
    { name: 'Bihar', count: 6 },
    { name: 'Jharkhand', count: 4 },
  ];

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
        <Grid container spacing={4}>
          {/* About Us Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ color: '#888888', mb: 3 }}>
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
            </Stack>
          </Grid>

          {/* Recent Posts Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Recent Posts
            </Typography>
            <Box>
              <Typography variant="body2" color="primary.main" sx={{ mb: 1 }}>
                NATIONAL
              </Typography>
              <Link href="#" color="inherit" underline="hover" sx={{ display: 'block', mb: 2 }}>
                IIT Kharagpur : भारत का पहला IIT
              </Link>
              <Typography variant="caption" sx={{ color: '#888888' }}>
                25 Mar, 2025
              </Typography>

              <Typography variant="body2" color="primary.main" sx={{ mb: 1, mt: 3 }}>
                TRENDING
              </Typography>
              <Link href="#" color="inherit" underline="hover" sx={{ display: 'block', mb: 2 }}>
                UNSC: 'शांति सैनिक अभियानों में खतरा, दोषियों को सजा मिलनी चाहिए', सुरक्षा परिषद में भारत का अहम बयान
              </Link>
              <Typography variant="caption" sx={{ color: '#888888' }}>
                25 Mar, 2025
              </Typography>
            </Box>
          </Grid>

          {/* Categories Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Categories
            </Typography>
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
                  <Link href="#" color="inherit" underline="hover">
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
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
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