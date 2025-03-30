import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShareIcon from '@mui/icons-material/Share';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const StateNews = () => {
  const { state, district } = useParams();

  const states = [
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
      en: 'Bihar',
      hi: 'बिहार',
      districts: [
        { en: 'Patna', hi: 'पटना' },
        { en: 'Gaya', hi: 'गया' },
        { en: 'Muzaffarpur', hi: 'मुजफ्फरपुर' }
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

  const trendingNews = [
    {
      image: '/state-news1.jpg',
      title: 'Major Infrastructure Project Announced for Urban Development',
      date: '15 January 2024'
    },
    {
      image: '/state-news2.jpg',
      title: 'New Educational Reforms Implemented in State Schools',
      date: '15 January 2024'
    },
    {
      image: '/state-news3.jpg',
      title: 'Local Festival Celebrates Cultural Heritage',
      date: '15 January 2024'
    },
    {
      image: '/state-news4.jpg',
      title: 'Healthcare Initiatives Launched in Rural Areas',
      date: '15 January 2024'
    },
    {
      image: '/state-news5.jpg',
      title: 'Agricultural Development Program Shows Promising Results',
      date: '15 January 2024'
    },
    {
      image: '/state-news6.jpg',
      title: 'Youth Employment Scheme Gains Momentum',
      date: '15 January 2024'
    }
  ];

  const renderStateBanner = (stateName, districtName = null) => {
    const stateData = states.find(s => s.en.toLowerCase() === stateName.toLowerCase());
    const districtData = districtName ? 
      stateData?.districts.find(d => d.en.toLowerCase() === districtName.toLowerCase()) :
      stateData?.districts[0];
    
    return (
      <Box
        sx={{
          width: '100%',
          height: '180px',
          bgcolor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          backgroundImage: `url(/state-banner-${stateName.toLowerCase()}.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          mb: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }
        }}
      >
        <Typography variant="h3" sx={{ position: 'relative', zIndex: 1, mb: 2 }}>
          {stateData?.en} / {stateData?.hi}
        </Typography>
        {districtData && (
          <Typography variant="h5" sx={{ position: 'relative', zIndex: 1 }}>
            {districtData.en} / {districtData.hi}
          </Typography>
        )}
      </Box>
    );
  };

  const renderNewsSection = () => (
    <>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        py: 2,
        borderBottom: '1px solid #eee'
      }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Trending News
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" sx={{ bgcolor: '#fff', boxShadow: 1 }}>
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton size="small" sx={{ bgcolor: '#fff', boxShadow: 1 }}>
            <NavigateNextIcon />
          </IconButton>
          <IconButton size="small" sx={{ bgcolor: '#fff', boxShadow: 1 }}>
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: { xs: '66px', sm: '51.7px' },
        mt: 3
      }}>
        {/* Featured Videos Section */}
        <Box sx={{ 
          width: '528.82px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              borderBottom: '2px solid #C4242B',
              pb: 1,
              mb: 2,
              width: 'fit-content',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}
          >
            Featured Videos
          </Typography>

          <Stack spacing={3} sx={{ width: '100%' }}>
            <Box sx={{ 
              width: '100%',
              bgcolor: '#fff',
              borderRadius: 1,
              overflow: 'visible',
              boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
              height: 'fit-content'
            }}>
              <Box sx={{ position: 'relative', width: '100%', height: '296px' }}>
                <img
                  src="/state-video1.jpg"
                  alt="State Video 1"
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60px',
                  height: '60px',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <PlayArrowIcon sx={{ color: '#fff', fontSize: '2rem' }} />
                </Box>
              </Box>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    15 January 2024
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    10:30 am
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, fontSize: '1.1rem', lineHeight: 1.3 }}>
                  Local Development Projects Making Progress
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary"
                  sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  read more ∨
                </Typography>
              </Box>
            </Box>

            <Box sx={{ 
              width: '100%',
              bgcolor: '#fff',
              borderRadius: 1,
              overflow: 'visible',
              boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
              height: 'fit-content'
            }}>
              <Box sx={{ position: 'relative', width: '100%', height: '296px' }}>
                <img
                  src="/state-video2.jpg"
                  alt="State Video 2"
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60px',
                  height: '60px',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <PlayArrowIcon sx={{ color: '#fff', fontSize: '2rem' }} />
                </Box>
              </Box>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    15 January 2024
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    9:15 am
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, fontSize: '1.1rem', lineHeight: 1.3 }}>
                  Cultural Festival Highlights Local Traditions
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary"
                  sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  read more ∨
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Trending News Section */}
        <Box sx={{ width: '386.23px' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              borderBottom: '2px solid #C4242B',
              pb: 1,
              mb: 2,
              width: 'fit-content',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}
          >
            Latest Updates
          </Typography>

          <Stack spacing={2}>
            {trendingNews.map((news, index) => (
              <Paper 
                key={index}
                elevation={0}
                sx={{ 
                  p: 2,
                  bgcolor: '#fff',
                  borderRadius: 1,
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <img
                      src={news.image}
                      alt={news.title}
                      style={{ 
                        width: '100%',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontSize: '0.875rem',
                        lineHeight: 1.2,
                        fontWeight: 500
                      }}
                    >
                      {news.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {news.date}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* Advertisement Section */}
        <Box sx={{ width: '150.38px' }}>
          <Stack spacing={2}>
            {[1, 2, 3].map((index) => (
              <Box
                key={index}
                sx={{
                  width: '150.38px',
                  height: '187.19px',
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <Typography color="text.secondary">ADs</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Bottom News Carousel */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2
        }}>
          <IconButton 
            size="small"
            sx={{
              bgcolor: '#fff',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#fff' }
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            overflow: 'hidden'
          }}>
            {trendingNews.slice(0, 4).map((news, index) => (
              <Paper key={index} sx={{ width: 270, boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
                <img
                  src={news.image}
                  alt={news.title}
                  style={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
                <Paper sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                    {news.title}
                  </Typography>
                </Paper>
              </Paper>
            ))}
          </Box>

          <IconButton 
            size="small"
            sx={{
              bgcolor: '#fff',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#fff' }
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );

  return (
    <Box sx={{ width: '100%', bgcolor: '#f8f8f8' }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {district ? (
          // Show single state with district when district is selected
          <>
            {renderStateBanner(state, district)}
            {renderNewsSection()}
          </>
        ) : (
          // Show all states with their first districts when no district is selected
          <>
            {states.map((stateData) => (
              <Box key={stateData.en} sx={{ mb: 8 }}>
                {renderStateBanner(stateData.en, stateData.districts[0].en)}
                {renderNewsSection()}
              </Box>
            ))}
          </>
        )}
      </Container>
    </Box>
  );
};

export default StateNews; 