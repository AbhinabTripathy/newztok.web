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

const Entertainment = () => {
  const trendingEntertainmentNews = [
    {
      image: '/entertainment-news1.jpg',
      title: 'Bollywood Blockbuster: Shah Rukh Khan\'s Latest Film Crosses 1000 Crore Mark Worldwide',
      date: '15 January 2024'
    },
    {
      image: '/entertainment-news2.jpg',
      title: 'Oscars 2024: Christopher Nolan\'s Oppenheimer Leads with 13 Nominations',
      date: '15 January 2024'
    },
    {
      image: '/entertainment-news3.jpg',
      title: 'Taylor Swift\'s Eras Tour Breaks Global Concert Records, Grosses Over $1 Billion',
      date: '15 January 2024'
    },
    {
      image: '/entertainment-news4.jpg',
      title: 'Netflix Announces New Indian Original Series with Aamir Khan',
      date: '15 January 2024'
    },
    {
      image: '/entertainment-news5.jpg',
      title: 'Beyoncé\'s Renaissance World Tour Documentary Sets Streaming Records',
      date: '15 January 2024'
    },
    {
      image: '/entertainment-news6.jpg',
      title: 'Marvel\'s Phase 5: New Avengers Lineup Revealed at Comic-Con 2024',
      date: '15 January 2024'
    }
  ];

  const lastWeekNews = [
    {
      image: '/entertainment-news7.jpg',
      title: 'Golden Globes 2024: Succession and Barbie Win Big at Annual Awards',
      date: '28 september 2024'
    },
    {
      image: '/entertainment-news8.jpg',
      title: 'BTS Member Jungkook Makes History with First Solo Grammy Nomination',
      date: '28 september 2024'
    },
    {
      image: '/entertainment-news9.jpg',
      title: 'Game of Thrones Prequel: House of the Dragon Season 2 Release Date Announced',
      date: '28 september 2024'
    },
    {
      image: '/entertainment-news10.jpg',
      title: 'Bollywood\'s Highest-Grossing Year: 2024 Box Office Records Shattered',
      date: '28 september 2024'
    },
    {
      image: '/entertainment-news11.jpg',
      title: 'Ed Sheeran\'s Mathematics Tour Becomes Highest-Grossing Tour of All Time',
      date: '28 september 2024'
    },
    {
      image: '/entertainment-news12.jpg',
      title: 'Disney+ Announces New Star Wars Series with Original Trilogy Cast',
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
            Trending Entertainment News
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
                    src="/entertainment-video1.jpg"
                    alt="Entertainment Video 1"
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
                    Behind the Scenes: Making of the Year\'s Biggest Bollywood Blockbuster
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
                    src="/entertainment-video2.jpg"
                    alt="Entertainment Video 2"
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
                    Taylor Swift\'s Eras Tour: The Making of a Billion-Dollar Phenomenon
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

          {/* Trending Entertainment News Section */}
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
              Trending Entertainment
            </Typography>

            <Stack spacing={2}>
              {trendingEntertainmentNews.map((news, index) => (
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
              {trendingEntertainmentNews.slice(0, 4).map((news, index) => (
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
                    src="/entertainment-video3.jpg"
                    alt="Entertainment Video 3"
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
                    Oscars 2024: Complete Winners List and Red Carpet Highlights
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
                    src="/entertainment-video4.jpg"
                    alt="Entertainment Video 4"
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
                    BTS: The Making of Their Latest Album and World Tour
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

export default Entertainment; 