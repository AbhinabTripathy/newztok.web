import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Grid
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from '../assets/images/NewzTok logo-2.svg';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Common style for all text input fields
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': { 
      bgcolor: '#fff',
      borderRadius: 1.5,
      height: 64  // Increased height even more
    },
    '& .MuiOutlinedInput-input': {
      fontSize: '1.1rem',  // Larger text
      padding: '16px 18px'  // More padding
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ddd',
      borderWidth: 1.5,
      boxShadow: '0 3px 5px rgba(0,0,0,0.07)'  // Enhanced shadow
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#bbb'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e73952',
      borderWidth: 2
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleBackClick = () => {
    navigate('/user/login'); // Navigate back to login
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!firstName.trim()) {
        throw new Error('Please enter your first name');
      }
      
      if (!lastName.trim()) {
        throw new Error('Please enter your last name');
      }
      
      if (!mobileNumber || mobileNumber.length < 10) {
        throw new Error('Please enter a valid mobile number');
      }
      
      if (!password) {
        throw new Error('Please enter a password');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // TODO: Replace with actual registration API call
      // Mocking success for now
      
      // Simulate API call delay
      setTimeout(() => {
        // On successful registration, redirect to login
        navigate('/user/login', { 
          state: { 
            registrationSuccess: true,
            message: 'Registration successful! Please login with your credentials.'
          }
        });
      }, 1500);
      
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8f8f8',
        position: 'relative',
        pt: 2
      }}
    >
      {/* Back button */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10
        }}
      >
        <IconButton
          onClick={handleBackClick}
          sx={{
            bgcolor: 'rgba(0,0,0,0.05)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.1)'
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box
          component="img"
          src={Logo}
          alt="NewzTok"
          sx={{ height: 70, mb: 2 }}
        />

        <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 'bold', fontSize: '1.8rem' }}>
          Create Account
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary' }}>
          Register as a user
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {/* First and Last Name row */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Box sx={{ flex: 1, mr: 1 }}>
                <Typography variant="caption" sx={{ mb: 1.5, display: 'block', fontWeight: 600, color: '#555', fontSize: '0.85rem' }}>
                  FIRST NAME
                </Typography>
                <TextField
                  fullWidth
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={textFieldStyle}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ mb: 1.5, display: 'block', fontWeight: 600, color: '#555', fontSize: '0.85rem' }}>
                  LAST NAME
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={textFieldStyle}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>  {/* Increased margin */}
            <Typography variant="caption" sx={{ mb: 1.5, display: 'block', fontWeight: 600, color: '#555', fontSize: '0.85rem' }}>
              MOBILE NUMBER
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              type="tel"
              inputProps={{ maxLength: 10 }}
              sx={textFieldStyle}
            />
          </Box>

          <Box sx={{ mb: 4 }}>  {/* Increased margin */}
            <Typography variant="caption" sx={{ mb: 1.5, display: 'block', fontWeight: 600, color: '#555', fontSize: '0.85rem' }}>
              PASSWORD
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textFieldStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>  {/* Increased margin */}
            <Typography variant="caption" sx={{ mb: 1.5, display: 'block', fontWeight: 600, color: '#555', fontSize: '0.85rem' }}>
              CONFIRM PASSWORD
            </Typography>
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={textFieldStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              bgcolor: '#e73952', 
              color: 'white', 
              py: 1.5, 
              fontSize: '1.1rem',
              height: 64,  // Match text input height
              '&:hover': { bgcolor: '#d32f2f' }, 
              textTransform: 'none', 
              fontWeight: 600, 
              borderRadius: 1.5
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Already have an account?{' '}
              <MuiLink
                component={Link}
                to="/user/login"
                sx={{ color: '#e73952', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
              >
                Login
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 