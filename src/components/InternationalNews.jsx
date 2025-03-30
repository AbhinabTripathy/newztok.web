import React from 'react';
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

const InternationalNews = () => {
  const trendingInternationalNews = [
    {
      image: '/world-news1.jpg',
      title: 'US Presidential Race: Trump Wins Iowa Caucus, Haley and DeSantis Battle for Second Place',
      date: '15 January 2024'
    },
    {
      image: '/world-news2.jpg',
      title: 'UK Economy: Bank of England Governor Warns of Persistent Inflation, Interest Rates to Stay High',
      date: '15 January 2024'
    },
    {
      image: '/world-news3.jpg',
      title: 'EU Migration Crisis: New Border Controls Implemented Amid Rising Asylum Applications',
      date: '15 January 2024'
    },
    {
      image: '/world-news4.jpg',
      title: 'China Economy: GDP Growth Target Set at 5% for 2024 Amid Property Market Challenges',
      date: '15 January 2024'
    },
    {
      image: '/world-news5.jpg',
      title: 'Middle East Crisis: UN Security Council Passes Resolution for Gaza Humanitarian Aid',
      date: '15 January 2024'
    },
    {
      image: '/world-news6.jpg',
      title: 'Global Climate Summit: World Leaders Commit to Triple Renewable Energy Capacity by 2030',
      date: '15 January 2024'
    }
  ];

  const lastWeekNews = [
    {
      image: '/world-news7.jpg',
      title: 'Japan Earthquake: Death Toll Rises to 200, Rescue Operations Continue Amid Aftershocks',
      date: '28 september 2024'
    },
    {
      image: '/world-news8.jpg',
      title: 'Russia-Ukraine War: NATO Announces New Military Aid Package Amid Escalating Tensions',
      date: '28 september 2024'
    },
    {
      image: '/world-news9.jpg',
      title: 'Brazil Floods: Thousands Evacuated as Heavy Rains Cause Widespread Damage in Rio de Janeiro',
      date: '28 september 2024'
    },
    {
      image: '/world-news10.jpg',
      title: 'Australia Wildfires: Emergency Declared as Bushfires Threaten Major Cities',
      date: '28 september 2024'
    },
    {
      image: '/world-news11.jpg',
      title: 'India-Canada Tensions: Diplomatic Row Escalates Over Sikh Separatist Issue',
      date: '28 september 2024'
    },
    {
      image: '/world-news12.jpg',
      title: 'Global Trade: WTO Warns of Rising Protectionism Amid Economic Uncertainty',
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
            Trending International News
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
                    src="/world-video1.jpg"
                    alt="World News Video 1"
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
                    Global Economic Summit: World Leaders Discuss Post-Pandemic Recovery Strategies
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
                    src="/world-video2.jpg"
                    alt="World News Video 2"
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
                    Climate Crisis: Record-Breaking Temperatures Reported Across Europe
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

          {/* Trending International News Section */}
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
              Trending International
            </Typography>

            <Stack spacing={2}>
              {trendingInternationalNews.map((news, index) => (
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
              {trendingInternationalNews.slice(0, 4).map((news, index) => (
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

        {/* Last Week News Section */}
        <Box sx={{ mt: 4, mb: 4 }}>
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
            Last Week
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: { xs: '66px', sm: '51.7px' }
          }}>
            <Box sx={{ width: '528.82px' }}>
              <Box sx={{ 
                width: '100%',
                bgcolor: '#fff',
                borderRadius: 1,
                overflow: 'visible',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                height: 'fit-content',
                mb: 3
              }}>
                <Box sx={{ position: 'relative', width: '100%', height: '296px' }}>
                  <img
                    src="/world-video3.jpg"
                    alt="World News Video 3"
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
                    Global Tech Summit: Major Breakthroughs in AI and Quantum Computing Announced
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
                    src="/world-video4.jpg"
                    alt="World News Video 4"
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
                    International Space Station: New Module Successfully Docked, Expanding Research Capabilities
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
            </Box>

            <Box sx={{ width: '386.23px' }}>
              <Stack spacing={2}>
                {lastWeekNews.map((news, index) => (
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
        </Box>
      </Container>
    </Box>
  );
};

export default InternationalNews; 