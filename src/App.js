import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import TopNews from './components/TopNews';
import NationalNews from './components/NationalNews';
import InternationalNews from './components/InternationalNews';
import Sports from './components/Sports';
import Entertainment from './components/Entertainment';
import StateNews from './components/State';
import MostShared from './components/MostShared';
import StayConnected from './components/StayConnected';
import Footer from './components/Footer';
import Login from './components/Login';
import JournalistHome from './components/Journalist/JournalistHome';
import ProtectedRoute from './components/Journalist/ProtectedRoute';
import EditorHome from './components/Editor/EditorHome';
import ProtectedEditorRoute from './components/ProtectedEditorRoute';
import { ThemeProvider, createTheme, Box, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/user/login';
  const isJournalistPage = location.pathname.startsWith('/journalist');

  // Define the activeTab state and its setter function
  const [activeTab, setActiveTab] = useState('Home');

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

  return (
    <ThemeProvider theme={createTheme()}>
      <Routes>
        {/* Journalist Routes */}
        <Route 
          path="/journalist/*" 
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<Navigate to="/journalist/home" replace />} />
                <Route path="/home" element={<JournalistHome />} />
              </Routes>
            </ProtectedRoute>
          } 
        />

        {/* User Routes */}
        <Route
          path="/*"
          element={
            <>
              {!isLoginPage && !isJournalistPage && <Header />}
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <TopNews />
                        <MostShared />
                        <StayConnected />
                      </>
                    }
                  />
                  <Route path="/national" element={<NationalNews />} />
                  <Route path="/international" element={<InternationalNews />} />
                  <Route path="/state" element={<StateNews />} />
                  <Route path="/state/:state" element={<StateNews />} />
                  <Route path="/state/:state/:district" element={<StateNews />} />
                  <Route path="/sports" element={<Sports />} />
                  <Route path="/entertainment" element={<Entertainment />} />
                  <Route path="/user/login" element={<Login />} />
                </Routes>
              </Box>
              {!isLoginPage && !isJournalistPage && <Footer />}
            </>
          }
        />

        {/* Protected Editor route */}
        <Route 
          path="/editor/*" 
          element={
            <ProtectedEditorRoute>
              <EditorHome />
            </ProtectedEditorRoute>
          } 
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
