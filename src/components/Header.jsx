import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Container,
  Stack,
  Switch,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Logo from '../assets/images/NewzTok logo-2.svg';

const Header = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stateMenuAnchor, setStateMenuAnchor] = useState(null);
  const [districtMenuState, setDistrictMenuState] = useState({ anchor: null, state: null });

  const navItems = ['Home', 'National', 'International', 'State', 'Sports', 'Entertainment'];
  const drawerItems = ['Analytics', 'Notification', 'FAQs', 'Contact Us', 'Dashboard'];

  const states = [
    { en: 'Jharkhand', hi: 'झारखंड', districts: [
      { en: 'Ranchi', hi: 'राँची' },
      { en: 'Dhanbad', hi: 'धनबाद' },
      { en: 'Jamshedpur', hi: 'जमशेदपुर' }
    ]},
    { en: 'Bihar', hi: 'बिहार', districts: [
      { en: 'Patna', hi: 'पटना' },
      { en: 'Gaya', hi: 'गया' },
      { en: 'Muzaffarpur', hi: 'मुजफ्फरपुर' }
    ]},
    { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', districts: [
      { en: 'Lucknow', hi: 'लखनऊ' },
      { en: 'Kanpur', hi: 'कानपुर' },
      { en: 'Varanasi', hi: 'वाराणसी' }
    ]}
  ];

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('Home');
    } else if (path.startsWith('/state')) {
      setActiveTab('State');
    } else {
      setActiveTab(path.slice(1).charAt(0).toUpperCase() + path.slice(2));
    }
  }, [location]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabPath = (item) => {
    switch(item.toLowerCase()) {
      case 'home':
        return '/';
      case 'national':
        return '/national';
      case 'state':
        return '/state';
      default:
        return `/${item.toLowerCase()}`;
    }
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleStateMenuOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setStateMenuAnchor(event.currentTarget);
  };

  const handleStateMenuClose = () => {
    setStateMenuAnchor(null);
    setDistrictMenuState({ anchor: null, state: null });
  };

  const handleDistrictMenuOpen = (event, state) => {
    event.preventDefault();
    event.stopPropagation();
    setDistrictMenuState({ anchor: event.currentTarget, state });
  };

  const handleDistrictMenuClose = () => {
    setDistrictMenuState({ anchor: null, state: null });
  };

  const handleStateClick = (event) => {
    event.preventDefault();
    handleTabClick('State');
    if (stateMenuAnchor) {
      handleStateMenuClose();
    } else {
      handleStateMenuOpen(event);
    }
  };

  const handleArrowClick = (event, state) => {
    event.preventDefault();
    event.stopPropagation();
    handleDistrictMenuOpen(event, state);
  };

  const handleDownArrowClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleTabClick('State');
    if (stateMenuAnchor) {
      handleStateMenuClose();
    } else {
      handleStateMenuOpen(event);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#333333', width: '100%' }}>
        <Container maxWidth={false} disableGutters sx={{ width: '100%' }}>
          {/* Top Bar with Social Icons */}
          <Toolbar 
            sx={{ 
              minHeight: '57px !important', 
              height: '57px',
              width: '100%',
              justifyContent: 'space-between',
              px: 2
            }}
          >
            <Stack direction="row" spacing={1}>
              <IconButton 
                size="small" 
                sx={{ color: 'white' }}
                href="https://www.instagram.com/newztok.news?utm_source=qr&igsh=MW5hOGlyZW0yZDhmaA=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'white' }}
                href="https://www.youtube.com/channel/UCn3IbwYbzMqebVC7AHlRD3A"
                target="_blank"
                rel="noopener noreferrer"
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'white' }}
                href="https://www.linkedin.com/company/newztok/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DarkModeIcon sx={{ color: 'white', mr: 1 }} />
                <Switch size="small" />
              </Box>
              <Button
                component={Link}
                to="/user/login"
                variant="text"
                startIcon={<PersonIcon />}
                sx={{ color: 'white' }}
              >
                Login
              </Button>
            </Stack>
          </Toolbar>

          {/* Main Navigation */}
          <Toolbar 
            sx={{ 
              justifyContent: 'space-between', 
              bgcolor: '#f0f0f0',
              width: '100%',
              minHeight: '64px !important',
              px: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onMouseEnter={handleDrawerOpen}
                sx={{ mr: 2, color: 'black' }}
              >
                <MenuIcon />
              </IconButton>
              <Box
                component="img"
                src={Logo}
                alt="NewzTok"
                sx={{ height: 100 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 3 }}>
              {navItems.map((item) => (
                <Box key={item} sx={{ position: 'relative' }}>
                  <Button
                    component={Link}
                    to={getTabPath(item)}
                    onClick={(e) => {
                      if (item === 'State') {
                        handleStateClick(e);
                      } else {
                        handleTabClick(item);
                      }
                    }}
                    endIcon={item === 'State' && (
                      <IconButton
                        size="small"
                        onClick={handleDownArrowClick}
                        sx={{
                          p: 0,
                          '&:hover': {
                            bgcolor: 'transparent'
                          }
                        }}
                      >
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    )}
                    sx={{
                      color: activeTab === item ? 'white' : 'black',
                      bgcolor: activeTab === item ? '#d32f2f' : 'transparent',
                      '&:hover': {
                        bgcolor: activeTab === item ? '#b71c1c' : 'rgba(0, 0, 0, 0.04)',
                      },
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                    }}
                  >
                    {item}
                  </Button>
                </Box>
              ))}
            </Box>

            {/* State Dropdown Menu */}
            <Menu
              anchorEl={stateMenuAnchor}
              open={Boolean(stateMenuAnchor)}
              onClose={handleStateMenuClose}
              MenuListProps={{ 
                onMouseLeave: handleStateMenuClose,
                sx: { py: 0 }
              }}
              PaperProps={{
                sx: { 
                  width: 220,
                  mt: 1
                }
              }}
              keepMounted
            >
              {states.map((state) => (
                <MenuItem
                  key={state.en}
                  component={Link}
                  to={`/state/${state.en.toLowerCase()}`}
                  onMouseEnter={(e) => handleDistrictMenuOpen(e, state)}
                  sx={{
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Box>
                    <Typography variant="body1">{state.en}</Typography>
                    <Typography variant="body2" color="text.secondary">{state.hi}</Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleArrowClick(e, state)}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'transparent' 
                      }
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </MenuItem>
              ))}
            </Menu>

            {/* District Dropdown Menu */}
            <Menu
              anchorEl={districtMenuState.anchor}
              open={Boolean(districtMenuState.anchor)}
              onClose={handleDistrictMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              MenuListProps={{ 
                onMouseLeave: handleDistrictMenuClose,
                sx: { py: 0 }
              }}
              PaperProps={{
                sx: { 
                  width: 200,
                  ml: 1,
                  boxShadow: 2
                }
              }}
              keepMounted
            >
              {districtMenuState.state?.districts.map((district) => (
                <MenuItem
                  key={district.en}
                  component={Link}
                  to={`/state/${districtMenuState.state.en.toLowerCase()}/${district.en.toLowerCase()}`}
                  sx={{ 
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Box>
                    <Typography variant="body1">{district.en}</Typography>
                    <Typography variant="body2" color="text.secondary">{district.hi}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: '#f8f8f8',
          },
        }}
        hideBackdrop={true}
        variant="temporary"
      >
        <Box 
          sx={{ p: 2 }}
          onMouseLeave={handleDrawerClose}
          onMouseEnter={handleDrawerOpen}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box
              component="img"
              src={Logo}
              alt="NewzTok"
              sx={{ height: 50 }}
            />
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ pt: 0 }}>
            {drawerItems.map((item, index) => (
              <ListItem 
                key={item} 
                disablePadding 
                sx={{ 
                  bgcolor: index === 0 ? '#f0f0f0' : 'transparent',
                  mb: 1
                }}
              >
                <ListItemButton>
                  <ListItemText 
                    primary={item} 
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        color: '#333'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header; 