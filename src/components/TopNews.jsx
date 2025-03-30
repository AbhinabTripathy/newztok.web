import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShareIcon from '@mui/icons-material/Share';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const TopNews = () => {
  const trendingNews = [
    {
      image: '/tcs-logo.jpg',
      title: 'TCS Hiring Alert: Tata Consultancy Services Confident To Hire 40,000 Freshers In 2025 As IT Major Positions Itself As AI-First Organisation, Chief HR Milind Lakkad',
      date: '28 september 2024'
    },
    {
      image: '/russia-ukraine.jpg',
      title: 'Russia-Ukraine War: The deceased has been identified as BSNF Lt. G, a resident of WoodMcKenzy in Kerala Thrissur district.',
      date: '28 september 2024'
    },
    {
      image: '/parking-fight.jpg',
      title: 'Behen ke L**e: Mother-Daughter Duo Gets Into Ugly Quarrel With Man Objecting To Wrong Parking In Delhi; Video Viral',
      date: '28 september 2024'
    },
    {
      image: '/bcci-speech.jpg',
      title: 'If not performance, then cut the money........BCCI suggested changes in incentive scheme.',
      date: '28 september 2024'
    },
    {
      image: '/delhi-cm.jpg',
      title: 'Delhi CM Atishi launches crowdfunding campaign, says need ₹40 lakh to fight election.',
      date: '28 september 2024'
    },
    {
      image: '/tcs-logo.jpg',
      title: 'TCS Hiring Alert: Tata Consultancy Services Confident To Hire 40,000 Freshers In 2025 As IT Major Positions Itself As AI-First Organisation, Chief HR Milind Lakkad',
      date: '28 september 2024'
    }
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: '#f8f8f8' }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          py: 2,
          borderBottom: '1px solid #eee'
        }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Top News
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
          {/* Videos Section */}
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
              Videos
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
                    src="/naga-monks.jpg"
                    alt="Naga monks"
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
                      13 jan 2025 on monday
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      5:15 am
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, fontSize: '1.1rem', lineHeight: 1.3 }}>
                    Thousands of Naga monks came out of the bath with a sword and trident in their hands; See PHOTOS.......
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
                    src="/solar-panels.jpg"
                    alt="Solar panels"
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
                      13 jan 2025 on monday
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      5:15 am
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, fontSize: '1.1rem', lineHeight: 1.3 }}>
                    Anil Ambani to invest ₹6500 crore in Andhra solar panel unit............
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

          {/* Trending Section */}
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
              Trending
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
              <Card sx={{ width: 270, boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
                <img
                  src="/delhi-cm.jpg"
                  alt="Delhi CM"
                  style={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                    Delhi CM Atishi launches crowdfunding campaign, says need ₹40 lakh to fight election.
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ width: 270, boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
                <img
                  src="/parking-fight.jpg"
                  alt="Parking fight"
                  style={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                    Behen ke L**e: Mother-Daughter Duo Gets Into Ugly Quarrel With Man Objecting To Wrong Parking In Delhi; Video Viral
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ width: 270, boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
                <img
                  src="/bcci-speech.jpg"
                  alt="BCCI speech"
                  style={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                    If not performance, then cut the money........BCCI suggested changes in incentive scheme.
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ width: 270, boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
                <img
                  src="/tcs-logo.jpg"
                  alt="TCS logo"
                  style={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                    TCS Hiring Alert: Tata Consultancy Services Confident To Hire 40,000 Freshers In 2025 As IT Major Positions Itself As AI-First Organisation, Chief HR Milind Lakkad
                  </Typography>
                </CardContent>
              </Card>
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
      </Container>
    </Box>
  );
};

export default TopNews; 