import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const PendingApprovals = () => {
  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb' }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        color: '#111827', 
        marginBottom: '24px' 
      }}>
        Pending Approval
      </h1>

      {/* Table */}
      <div style={{ 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '16px'
      }}>
        {/* Table Headers */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          borderBottom: '1px solid #e5e7eb',
        }}>
          <div style={{ 
            color: '#374151', 
            fontWeight: '500', 
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderRight: '1px solid #e5e7eb'
          }}>
            Headline <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
          </div>
          <div style={{ 
            color: '#374151', 
            fontWeight: '500', 
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderRight: '1px solid #e5e7eb'
          }}>
            Excerpts <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
          </div>
          <div style={{ 
            color: '#374151', 
            fontWeight: '500', 
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px'
          }}>
            Submitted By: <FiChevronDown size={16} style={{ marginLeft: '4px', color: '#9ca3af' }} />
          </div>
        </div>

        {/* Empty State */}
        <div style={{ 
          padding: '24px 16px',
          textAlign: 'center',
          color: '#6b7280',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: 'white'
        }}>
          No posts available for approval.
        </div>
      </div>

      {/* Pagination */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        color: '#6b7280',
        fontSize: '14px'
      }}>
        <div>
          1 to 1 Items of 1 — 
          <button style={{ 
            color: '#4f46e5', 
            backgroundColor: 'transparent', 
            border: 'none', 
            padding: '0 4px', 
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            fontWeight: '500'
          }}>
            View all <HiOutlineArrowNarrowRight style={{ marginLeft: '4px' }} />
          </button>
        </div>
        
        {/* Pagination Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ 
            padding: '8px 16px', 
            backgroundColor: '#e5edff', 
            color: '#4f46e5', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Previous
          </button>
          <button style={{ 
            padding: '8px 16px', 
            backgroundColor: '#e5edff', 
            color: '#4f46e5', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals; 