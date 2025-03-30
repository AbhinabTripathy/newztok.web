import React from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import RssFeedIcon from '@mui/icons-material/RssFeed';

const SocialButton = ({ icon, count, label, color }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      bgcolor: color,
      color: 'white',
      borderRadius: 0,
      overflow: 'hidden',
      cursor: 'pointer',
      height: '60px',
      width: '100%',
      '&:hover': {
        opacity: 0.9
      }
    }}
  >
    <Box sx={{ 
      pl: 3,
      display: 'flex', 
      alignItems: 'center',
      gap: 2
    }}>
      {icon}
      <Box>
        <Typography sx={{ fontSize: '1rem', fontWeight: 500, mb: 0.2 }}>
          {count.toLocaleString()}
        </Typography>
        <Typography sx={{ fontSize: '0.9rem' }}>
          {label}
        </Typography>
      </Box>
    </Box>
  </Box>
);

const StayConnected = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: '#f8f8f8', mt: 4, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Social Media Section */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h6" 
              sx={{ 
                borderBottom: '2px solid #C4242B',
                pb: 1,
                mb: 3,
                width: 'fit-content',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}
            >
              Stay Connected
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px',
              width: '100%',
              maxWidth: '600px'
            }}>
              {/* Row 1 */}
              <Box sx={{ display: 'flex', gap: '20px', width: '100%' }}>
                <Box sx={{ flex: 1, minWidth: '290px' }}>
                  <SocialButton 
                    icon={<FacebookIcon sx={{ fontSize: '2rem' }} />}
                    count={4556353}
                    label="Fans"
                    color="#3b5998"
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '290px' }}>
                  <SocialButton 
                    icon={<TwitterIcon sx={{ fontSize: '2rem' }} />}
                    count={4556353}
                    label="Followers"
                    color="#1DA1F2"
                  />
                </Box>
              </Box>

              {/* Row 2 */}
              <Box sx={{ display: 'flex', gap: '20px', width: '100%' }}>
                <Box sx={{ flex: 1, minWidth: '290px' }}>
                  <SocialButton 
                    icon={<LinkedInIcon sx={{ fontSize: '2rem' }} />}
                    count={4556353}
                    label="Connect"
                    color="#0077b5"
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '290px' }}>
                  <SocialButton 
                    icon={<YouTubeIcon sx={{ fontSize: '2rem' }} />}
                    count={13156634}
                    label="Subscribers"
                    color="#FF0000"
                  />
                </Box>
              </Box>

              {/* Row 3 */}
              <Box sx={{ display: 'flex', gap: '20px', width: '100%' }}>
                <Box sx={{ flex: 1, minWidth: '290px' }}>
                  <SocialButton 
                    icon={<InstagramIcon sx={{ fontSize: '2rem' }} />}
                    count={4556353}
                    label="Followers"
                    color="#C13584"
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '290px' }}>
                  <SocialButton 
                    icon={<RssFeedIcon sx={{ fontSize: '2rem' }} />}
                    count={13156634}
                    label="Subscribers"
                    color="#ee802f"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Newsletter Section */}
          <Grid item xs={12} md={6} sx={{ mt: { xs: 0, md: 5.5 } }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                bgcolor: '#fff',
                borderRadius: 1,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <Typography 
                variant="h6" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  mb: 1
                }}
              >
                SUBSCRIBE TO OUR NEWSLETTER
              </Typography>
              <Typography 
                variant="body2" 
                align="center"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Subscribe for new update
              </Typography>

              <TextField
                fullWidth
                placeholder="Enter E-mail ID"
                variant="outlined"
                sx={{ 
                  mb: 2,
                  bgcolor: '#f8f8f8',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ 
                  bgcolor: '#1a237e',
                  color: 'white',
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#0d47a1'
                  }
                }}
              >
                SUBSCRIBE
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StayConnected; 