import React, { useState } from 'react';
import JournalistSidebar from './JournalistSidebar';
import JournalistHeader from './JournalistHeader';
import JournalistFooter from './JournalistFooter';
import Overview from './Overview';
import StandardPost from './StandardPost';
import VideoPost from './VideoPost';
import PendingApprovals from './PendingApprovals';

// Placeholder components for other screens
const Posts = () => <div style={{ padding: '30px' }}><h1>Posts List</h1></div>;
const Rejected = () => <div style={{ padding: '30px' }}><h1>Rejected Posts</h1></div>;

const JournalistHome = () => {
  const [activeSection, setActiveSection] = useState('overview');

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
      default:
        return <Overview />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <JournalistHeader />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '250px', backgroundColor: '#1e2029' }}>
          <JournalistSidebar onSectionChange={handleSectionChange} />
        </div>
        
        <main style={{ flex: 1, overflow: 'auto', backgroundColor: '#f8fafc' }}>
          {renderContent()}
        </main>
      </div>
      
      <JournalistFooter />
    </div>
  );
};

export default JournalistHome; 