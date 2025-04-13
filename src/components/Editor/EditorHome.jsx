import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EditorSidebar from './EditorSidebar';
import EditorHeader from './EditorHeader';
import EditorFooter from './EditorFooter';
import Overview from './Overview';
import StandardPost from './StandardPost';
import VideoPost from './VideoPost';
import Posts from './Posts';
import PendingApprovals from './PendingApprovals';
import Rejected from './Rejected';
import Users from './Users';
import AddViewUsers from './AddViewUsers';
import Profile from './Profile';

const EditorHome = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const location = useLocation();

  // Check the URL path to determine which section to show
  useEffect(() => {
    const path = location.pathname;

    if (path.includes('/editor/standardPost')) {
      setActiveSection('standardPost');
    } else if (path.includes('/editor/videoPost')) {
      setActiveSection('videoPost');
    } else if (path.includes('/editor/posts')) {
      setActiveSection('posts');
    } else if (path.includes('/editor/pendingApprovals')) {
      setActiveSection('pendingApprovals');
    } else if (path.includes('/editor/rejected')) {
      setActiveSection('rejected');
    } else if (path.includes('/editor/users')) {
      setActiveSection('users');
    } else if (path.includes('/editor/addViewUsers')) {
      setActiveSection('addViewUsers');
    } else if (path.includes('/editor/profile')) {
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
        return <Posts />;
      case 'pendingApprovals':
        return <PendingApprovals />;
      case 'rejected':
        return <Rejected />;
      case 'users':
        return <Users />;
      case 'addViewUsers':
        return <AddViewUsers />;
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
      {shouldShowHeaderAndSidebar && <EditorHeader />}
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {shouldShowHeaderAndSidebar && (
          <div style={{ width: '250px', backgroundColor: '#1e2029' }}>
            <EditorSidebar onSectionChange={handleSectionChange} activeSection={activeSection} />
          </div>
        )}
        
        <main style={{ flex: 1, overflow: 'auto', backgroundColor: '#f8fafc' }}>
          {renderContent()}
        </main>
      </div>
      
      {shouldShowHeaderAndSidebar && <EditorFooter />}
    </div>
  );
};

export default EditorHome; 