import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const MostShared = () => {
  const sharedVideos = [
    {
      image: '/la-fire.jpg',
      title: 'Los Angeles firefighters braced for high winds overnight into Tuesday, gusts that could fuel two monstrous wildfires that have already leveled entire neighborhoods, killed at least two dozen people, and burned an area the size of Washington, D.C.',
    },
    {
      image: '/naga-monks.jpg',
      title: 'Thousands of Naga monks came out of the bath with a sword and trident in their hands; See PHOTOS.......',
    },
    {
      image: '/la-fire.jpg',
      title: 'Los Angeles firefighters braced for high winds overnight into Tuesday...',
    },
    {
      image: '/naga-monks.jpg',
      title: 'Thousands of Naga monks came out of the bath with a sword and trident...',
    }
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: '#f8f8f8', mt: 4, pb: 4 }}>
      <Container maxWidth="lg">
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
          Most Shared
        </Typography>

        <Box sx={{ position: 'relative' }}>
          <Box sx={{ 
            display: 'flex',
            gap: 3,
            overflowX: 'hidden',
            position: 'relative',
            mx: 5, // Margin for navigation buttons
            justifyContent: 'center'
          }}>
            {sharedVideos.map((video, index) => (
              <Box
                key={index}
                sx={{
                  width: '520px',
                  minWidth: '520px',
                  bgcolor: '#fff',
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                  flex: '0 0 auto'
                }}
              >
                <Box sx={{ position: 'relative', width: '100%', height: '300px' }}>
                  <img
                    src={video.image}
                    alt={video.title}
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
                    <PlayArrowIcon sx={{ color: '#fff', fontSize: '2.5rem' }} />
                  </Box>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      lineHeight: 1.3,
                      maxHeight: '2.6em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {video.title}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Navigation Buttons */}
          <IconButton 
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: '#fff',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#fff' },
              zIndex: 2
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton 
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: '#fff',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#fff' },
              zIndex: 2
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default MostShared; 