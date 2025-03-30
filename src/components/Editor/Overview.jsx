import React from 'react';
import { FaRegNewspaper, FaUsers, FaFileAlt, FaTimesCircle } from 'react-icons/fa';

const Overview = () => {
  // Dummy data (you would fetch this from an API in a real app)
  const stats = {
    approvedPosts: 11,
    membersAdded: 7,
    pendingApprovals: 1,
    rejectedPosts: 1
  };

  return (
    <div style={{ padding: '30px 40px' }}>
      <div>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0', 
          fontWeight: 'bold', 
          color: '#111827' 
        }}>
          Editorial Dashboard
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          margin: '0.5rem 0 2.5rem 0', 
          color: '#6b7280' 
        }}>
          Welcome, rajesheditor@newztok.com
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '20px'
      }}>
        {/* Approved Posts */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '15px 25px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          minWidth: '220px'
        }}>
          <div style={{ 
            backgroundColor: 'rgba(37, 99, 235, 0.1)', 
            borderRadius: '8px',
            padding: '12px',
            marginRight: '20px'
          }}>
            <FaRegNewspaper size={32} color="#1d4ed8" />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              margin: '0',
              color: '#111827'
            }}>
              {stats.approvedPosts}
            </h2>
            <div style={{ fontSize: '1rem', color: '#4b5563' }}>Posts</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Approved</div>
          </div>
        </div>

        {/* Members */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '15px 25px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          minWidth: '220px'
        }}>
          <div style={{ 
            backgroundColor: 'rgba(22, 163, 74, 0.1)', 
            borderRadius: '8px',
            padding: '12px',
            marginRight: '20px'
          }}>
            <FaUsers size={32} color="#15803d" />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              margin: '0',
              color: '#111827'
            }}>
              {stats.membersAdded}
            </h2>
            <div style={{ fontSize: '1rem', color: '#4b5563' }}>Members</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Users Added</div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '15px 25px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          minWidth: '220px'
        }}>
          <div style={{ 
            backgroundColor: 'rgba(234, 88, 12, 0.1)', 
            borderRadius: '8px',
            padding: '12px',
            marginRight: '20px'
          }}>
            <FaFileAlt size={32} color="#ea580c" />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              margin: '0',
              color: '#111827'
            }}>
              {stats.pendingApprovals}
            </h2>
            <div style={{ fontSize: '1rem', color: '#4b5563' }}>Posts</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending Approvals</div>
          </div>
        </div>

        {/* Rejects */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '15px 25px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          minWidth: '220px'
        }}>
          <div style={{ 
            backgroundColor: 'rgba(220, 38, 38, 0.1)', 
            borderRadius: '8px',
            padding: '12px',
            marginRight: '20px'
          }}>
            <FaTimesCircle size={32} color="#dc2626" />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              margin: '0',
              color: '#111827'
            }}>
              {stats.rejectedPosts}
            </h2>
            <div style={{ fontSize: '1rem', color: '#4b5563' }}>Rejects</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Post Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 