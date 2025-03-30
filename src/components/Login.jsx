import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  Paper,
  Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/images/NewzTok logo-2.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://13.218.80.21:3333/api/auth/login', {
        email,
        password
      });

      const result = response.data;
      console.log("API Login successful:", result);

      if (rememberMe) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userRole', result.role);
      } else {
        sessionStorage.setItem('authToken', result.token);
        sessionStorage.setItem('userRole', result.role);
      }

      switch (result.role?.toLowerCase()) {
        case 'journalist':
          navigate('/journalist');
          break;
        case 'editor':
          navigate('/editor');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error("API Login failed:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
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
        bgcolor: '#f8f8f8'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'transparent'
        }}
      >
        <Box
          component="img"
          src={Logo}
          alt="NewzTok"
          sx={{ height: 80, mb: 3 }}
        />

        <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Staff Access
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary' }}>
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
              EMAIL
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
              PASSWORD
            </Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: '#1976d2', '&.Mui-checked': { color: '#1976d2' } }}
                />
              }
              label="Remember me"
            />
            <MuiLink
              component={Link}
              to="/forgot-password"
              sx={{ color: '#1976d2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Forgot Password?
            </MuiLink>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: '#1976d2', color: 'white', py: 1.5, '&:hover': { bgcolor: '#1565c0' } }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;