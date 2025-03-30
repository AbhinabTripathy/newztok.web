import React, { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Rejected = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Sample data based on the image provided
  const rejectedPosts = [
    {
      id: 1,
      headline: 'Testing News',
      category: 'राष्ट्रीय | National',
      submittedBy: 'rajesh@newztok.com',
      featured: true
    }
  ];

  const toggleDropdown = (postId, event) => {
    // Stop event propagation to prevent immediate closing
    event.stopPropagation();
    
    if (activeDropdown === postId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(postId);
    }
  };

  // Close dropdown when clicking anywhere on the document
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleView = (postId, event) => {
    event.stopPropagation();
    console.log('Viewing post:', postId);
    setActiveDropdown(null);
  };

  const handleRemove = (postId, event) => {
    event.stopPropagation();
    console.log('Removing post:', postId);
    setActiveDropdown(null);
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      {/* Header section with title */}
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        color: '#111827',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '30px'
      }}>
        All Rejected Posts 
        <span style={{ 
          fontSize: '24px', 
          color: '#6b7280', 
          fontWeight: 'normal'
        }}>
          (1)
        </span>
      </h1>
      
      {/* Table */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
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
                textAlign: 'center', 
                fontWeight: '500',
                color: '#374151'
              }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {rejectedPosts.map(post => (
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
                <td style={{ padding: '16px', textAlign: 'center', position: 'relative' }}>
                  <div onClick={(e) => e.stopPropagation()}>
                    <button 
                      style={{ 
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: '5px'
                      }}
                      onClick={(e) => toggleDropdown(post.id, e)}
                      aria-label="More options"
                    >
                      <FaEllipsisV />
                    </button>
                    
                    {activeDropdown === post.id && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: 'absolute',
                          right: '0',
                          top: '100%',
                          marginTop: '8px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          width: '140px',
                          zIndex: 10,
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <div 
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#374151',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                          onClick={(e) => handleView(post.id, e)}
                        >
                          View
                        </div>
                        <div 
                          style={{
                            padding: '12px 16px',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                          onClick={(e) => handleRemove(post.id, e)}
                        >
                          Remove
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <div>
          1 to 1 Items of 1 — <Link to="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>View all</Link>
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
  );
};

export default Rejected; 