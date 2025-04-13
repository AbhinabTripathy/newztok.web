import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import JournalistSidebar from './JournalistSidebar';
import JournalistHeader from './JournalistHeader';
import JournalistFooter from './JournalistFooter';
import Overview from './Overview';
import StandardPost from './StandardPost';
import VideoPost from './VideoPost';
import PendingApprovals from './PendingApprovals';
import JournalistPost from './JournalistPost';
import JournalistRejected from './JournalistRejected';
import Profile from './Profile';

// Placeholder components for other screens
const Rejected = () => <div style={{ padding: '30px' }}><h1>Rejected Posts</h1></div>;

const JournalistHome = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const location = useLocation();

  // Check the URL path to determine which section to show
  useEffect(() => {
    const path = location.pathname;

    if (path.includes('/journalist/standardPost')) {
      setActiveSection('standardPost');
    } else if (path.includes('/journalist/videoPost')) {
      setActiveSection('videoPost');
    } else if (path.includes('/journalist/posts')) {
      setActiveSection('posts');
    } else if (path.includes('/journalist/pendingApprovals')) {
      setActiveSection('pendingApprovals');
    } else if (path.includes('/journalist/rejected')) {
      setActiveSection('rejected');
    } else if (path.includes('/journalist/profile')) {
      setActiveSection('profile');
    } else {
      setActiveSection('overview');
    }
  }, [location]);

  // Function to share with sidebar to update active section
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Render the appropriate component based on activeSection
  const renderContent = () => {
    switch (activeSection) {
      case 'standardPost':
        return <StandardPost />;
      case 'videoPost':
        return <VideoPost />;
      case 'posts':
        return <JournalistPost />;
      case 'pendingApprovals':
        return <PendingApprovals />;
      case 'rejected':
        return <JournalistRejected />;
      case 'profile':
        return <Profile />;
      default:
        return <Overview />;
    }
  };

  // Check if we should hide the header, sidebar, and footer
  const shouldShowHeaderAndSidebar = activeSection !== 'profile';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {shouldShowHeaderAndSidebar ? (
        <>
          <JournalistHeader />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <div style={{ width: '250px', backgroundColor: '#1e2029' }}>
              <JournalistSidebar onSectionChange={handleSectionChange} activeSection={activeSection} />
            </div>
            
            <main style={{ flex: 1, overflow: 'auto', backgroundColor: '#f8fafc' }}>
              {renderContent()}
            </main>
          </div>
          
          <JournalistFooter />
        </>
      ) : (
        <main style={{ flex: 1, overflow: 'auto' }}>
          {renderContent()}
        </main>
      )}
    </div>
  );
};

export default JournalistHome; 