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

const Sports = () => {
  const trendingSportsNews = [
    {
      image: '/sports-news1.jpg',
      title: 'India vs England Test Series: Rohit Sharma Leads Team India in Historic 500th Test Match',
      date: '15 January 2024'
    },
    {
      image: '/sports-news2.jpg',
      title: 'Australian Open 2024: Novak Djokovic Aims for Record 25th Grand Slam Title',
      date: '15 January 2024'
    },
    {
      image: '/sports-news3.jpg',
      title: 'Premier League: Arsenal Defeats Liverpool in Thrilling 3-1 Victory at Emirates',
      date: '15 January 2024'
    },
    {
      image: '/sports-news4.jpg',
      title: 'Pro Kabaddi League: Patna Pirates Clinch Title in Nail-Biting Final Against Puneri Paltan',
      date: '15 January 2024'
    },
    {
      image: '/sports-news5.jpg',
      title: 'Asian Games 2024: India Wins Gold in Men\'s Hockey, Qualifies for Paris Olympics',
      date: '15 January 2024'
    },
    {
      image: '/sports-news6.jpg',
      title: 'Formula 1: Red Bull Racing Announces New Partnership with Major Tech Company',
      date: '15 January 2024'
    }
  ];

  const lastWeekNews = [
    {
      image: '/sports-news7.jpg',
      title: 'ICC World Cup 2024: India\'s Squad Announced, Virat Kohli to Lead Team',
      date: '28 september 2024'
    },
    {
      image: '/sports-news8.jpg',
      title: 'NBA: Golden State Warriors Break Record for Most Three-Pointers in a Game',
      date: '28 september 2024'
    },
    {
      image: '/sports-news9.jpg',
      title: 'UEFA Champions League: Real Madrid vs Manchester City Quarter-Final Draw Announced',
      date: '28 september 2024'
    },
    {
      image: '/sports-news10.jpg',
      title: 'Olympic Games 2024: India\'s Medal Tally Reaches 50, Best Performance Ever',
      date: '28 september 2024'
    },
    {
      image: '/sports-news11.jpg',
      title: 'Badminton: PV Sindhu Wins Malaysia Open, Moves to World No. 2 Ranking',
      date: '28 september 2024'
    },
    {
      image: '/sports-news12.jpg',
      title: 'Boxing: Nikhat Zareen Qualifies for Paris Olympics with Gold Medal Win',
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
            Trending Sports News
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
                    src="/sports-video1.jpg"
                    alt="Sports Video 1"
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
                    Cricket World Cup 2024: India\'s Historic Victory Against Australia in Final
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
                    src="/sports-video2.jpg"
                    alt="Sports Video 2"
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
                    Olympic Games 2024: India\'s Medal Tally Reaches New Heights
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

          {/* Trending Sports News Section */}
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
              Trending Sports
            </Typography>

            <Stack spacing={2}>
              {trendingSportsNews.map((news, index) => (
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
              {trendingSportsNews.slice(0, 4).map((news, index) => (
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
                    src="/sports-video3.jpg"
                    alt="Sports Video 3"
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
                    IPL 2024: Mumbai Indians vs Chennai Super Kings - Match Highlights
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
                    src="/sports-video4.jpg"
                    alt="Sports Video 4"
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
                    Pro Kabaddi League: Patna Pirates vs Puneri Paltan - Final Match Highlights
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

export default Sports; 