import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaEllipsisV, FaFileAlt, FaVideo } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Posts = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigate = (path) => {
    setDropdownOpen(false);
    // These would be the paths to your post creation screens
    if (path === 'standard') {
      navigate('/editor/standardPost');
    } else if (path === 'video') {
      navigate('/editor/videoPost');
    }
  };

  // Sample data based on the image provided
  const posts = [
    {
      id: 1,
      headline: 'IIT Kharagpur : भारत का पहला IIT',
      category: 'राष्ट्रीय | National',
      submittedBy: 'prakash.journalist@newztok.com',
      submittedAt: '25-03-2025 20:06',
      approvedBy: '',
      approvedAt: '',
      featured: true
    },
    {
      id: 2,
      headline: "UNSC: 'आर्थिक सैनिक अभियानों में खतरा, दोषियों को सजा मिलनी चाहिए', सुरक्षा परिषद में भारत का अहम बयान",
      category: 'ट्रेंडिंग | Trending',
      submittedBy: 'prakash.journalist@newztok.com',
      submittedAt: '25-03-2025 12:34',
      approvedBy: '',
      approvedAt: '25-03-2025 12:34',
      featured: true
    },
    {
      id: 3,
      headline: 'छत्तीसगढ़ में पूर्व सीएम भूपेश बघेल के यहां रेड के दौरान ED की टीम पर हमला',
      category: 'राष्ट्रीय | National',
      submittedBy: 'chatrapati_abhinab',
      submittedAt: '10-03-2025 22:50',
      approvedBy: '',
      approvedAt: '10-03-2025 22:50',
      featured: false
    },
    {
      id: 4,
      headline: 'छत्तीसगढ़ में पूर्व सीएम भूपेश बघेल के यहां रेड के दौरान ED की टीम पर हमला',
      category: 'राष्ट्रीय | National',
      submittedBy: 'Abhi',
      submittedAt: '10-03-2025 22:35',
      approvedBy: '',
      approvedAt: '10-03-2025 22:35',
      featured: false
    },
    {
      id: 5,
      headline: 'Air India flight from Mumbai to New York diverts due to security threat',
      category: 'ट्रेंडिंग | Trending',
      submittedBy: 'Abhi',
      submittedAt: '10-03-2025 12:47',
      approvedBy: '',
      approvedAt: '10-03-2025 12:47',
      featured: false
    }
  ];

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      {/* Header section with title and button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          All Approved Posts 
          <span style={{ 
            fontSize: '24px', 
            color: '#6b7280', 
            fontWeight: 'normal'
          }}>
            (11)
          </span>
        </h1>
        
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaPlus size={16} />
            Add new Post
          </button>
          
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              width: '180px',
              zIndex: 10
            }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => handleNavigate('standard')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FaFileAlt size={16} color="#4f46e5" />
                <span>Standard Post</span>
              </div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => handleNavigate('video')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FaVideo size={16} color="#4f46e5" />
                <span>Video Post</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflowX: 'auto'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Headline <span style={{ color: '#9ca3af' }}>↓</span>
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Category <span style={{ color: '#9ca3af' }}>↓</span>
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Submitted By <span style={{ color: '#9ca3af' }}>↓</span>
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Approved By <span style={{ color: '#9ca3af' }}>↓</span>
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Submitted At <span style={{ color: '#9ca3af' }}>↓</span>
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Approved At <span style={{ color: '#9ca3af' }}>↓</span>
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'center', 
                fontWeight: '500',
                color: '#374151'
              }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', maxWidth: '300px' }}>
                  <div style={{ marginBottom: post.featured ? '5px' : '0' }}>
                    <Link 
                      to="#" 
                      style={{ 
                        color: '#3b82f6', 
                        textDecoration: 'none',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '300px'
                      }}
                    >
                      {post.headline}
                    </Link>
                  </div>
                  {post.featured && (
                    <span style={{ 
                      backgroundColor: '#ecfdf5', 
                      color: '#10b981',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      FEATURED
                    </span>
                  )}
                </td>
                <td style={{ padding: '16px' }}>{post.category}</td>
                <td style={{ padding: '16px' }}>{post.submittedBy}</td>
                <td style={{ padding: '16px' }}>{post.approvedBy}</td>
                <td style={{ padding: '16px' }}>{post.submittedAt}</td>
                <td style={{ padding: '16px' }}>{post.approvedAt}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button 
                    style={{ 
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      padding: '5px'
                    }}
                    aria-label="More options"
                  >
                    <FaEllipsisV />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>
            1 to 5 Items of 11 — <Link to="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>View all</Link>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              style={{ 
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#e2e8f0',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Previous
            </button>
            <button 
              style={{ 
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts; 