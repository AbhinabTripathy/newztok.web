import React from 'react';
import { FaBuilding } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';
import { MdErrorOutline } from 'react-icons/md';

const Overview = () => {
  return (
    <div className="overview-container" style={{ padding: '30px' }}>
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: 'bold', 
        marginBottom: '30px', 
        color: '#1f2937' 
      }}>
        Unknown Role
      </h1>

      <div style={{ 
        display: 'flex', 
        gap: '24px' 
      }}>
        {/* Approved Posts Card */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              backgroundColor: '#e6f0ff', 
              borderRadius: '8px', 
              width: '50px', 
              height: '50px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <IoDocumentTextOutline size={24} color="#0055ff" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginRight: '12px' }}>0</h2>
            <span style={{ fontSize: '18px', color: '#6b7280' }}>Posts</span>
          </div>
          <p style={{ color: '#6b7280', margin: 0 }}>Approved</p>
        </div>

        {/* Pending Approvals Card */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              backgroundColor: '#fff1e6', 
              borderRadius: '8px', 
              width: '50px', 
              height: '50px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <BsClockHistory size={24} color="#ff6b00" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginRight: '12px' }}>1</h2>
            <span style={{ fontSize: '18px', color: '#6b7280' }}>Posts</span>
          </div>
          <p style={{ color: '#6b7280', margin: 0 }}>Pending Approvals</p>
        </div>

        {/* Rejected Posts Card */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              backgroundColor: '#ffe6e6', 
              borderRadius: '8px', 
              width: '50px', 
              height: '50px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <MdErrorOutline size={24} color="#ff0000" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginRight: '12px' }}>1</h2>
            <span style={{ fontSize: '18px', color: '#6b7280' }}>Rejects</span>
          </div>
          <p style={{ color: '#6b7280', margin: 0 }}>Post Rejected</p>
        </div>
      </div>
    </div>
  );
};

export default Overview; 