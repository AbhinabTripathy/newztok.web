import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

const AddViewUsers = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Editor',
    phoneNumber: '',
    profilePicture: null,
    assignedState: 'बिहार | Bihar',
    assignedDistrict: ''
  });

  // State options as shown in the image
  const stateOptions = [
    'बिहार | Bihar',
    'उत्तर प्रदेश | Uttar Pradesh',
    'झारखंड | Jharkhand'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        profilePicture: e.target.files[0]
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Editor',
      phoneNumber: '',
      profilePicture: null,
      assignedState: '',
      assignedDistrict: ''
    });
  };

  const handleBackToProfile = () => {
    navigate('/editor/users');
  };

  return (
    <div style={{ 
      padding: '30px', 
      backgroundColor: '#f9fafb' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '16px' 
        }}>
          Create User
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#4b5563', 
          marginBottom: '24px' 
        }}>
          Create a new user by filling out the form below.
        </p>

        <button
          onClick={handleBackToProfile}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            border: 'none', 
            fontSize: '16px', 
            fontWeight: '500', 
            cursor: 'pointer', 
            marginBottom: '32px' 
          }}
        >
          Back to Profile
        </button>

        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '24px', 
            marginBottom: '24px' 
          }}>
            {/* Username */}
            <div>
              <label 
                htmlFor="username"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#111827' 
                }}
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username (optional)"
                value={formData.username}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  fontSize: '16px' 
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#111827' 
                }}
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  fontSize: '16px' 
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#111827' 
                }}
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  fontSize: '16px' 
                }}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label 
                htmlFor="confirmPassword"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#111827' 
                }}
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  fontSize: '16px' 
                }}
              />
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '24px', 
            marginBottom: '24px' 
          }}>
            {/* Role */}
            <div>
              <label 
                htmlFor="role"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#111827' 
                }}
              >
                Role:
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                readOnly
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  fontSize: '16px',
                  backgroundColor: '#f3f4f6' 
                }}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label 
                htmlFor="phoneNumber"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#111827' 
                }}
              >
                Phone Number:
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phone number (optional)"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  fontSize: '16px' 
                }}
              />
            </div>

            {/* Profile Picture */}
            <div>
              <label 
                htmlFor="profilePicture"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#111827' 
                }}
              >
                Profile Picture:
              </label>
              <div style={{ 
                display: 'flex', 
                width: '100%' 
              }}>
                <label 
                  htmlFor="profilePictureInput"
                  style={{ 
                    backgroundColor: '#f3f4f6', 
                    padding: '12px 16px', 
                    border: '1px solid #d1d5db', 
                    borderRight: 'none', 
                    borderRadius: '8px 0 0 8px', 
                    fontSize: '16px',
                    cursor: 'pointer' 
                  }}
                >
                  Choose File
                </label>
                <span 
                  style={{ 
                    flex: 1, 
                    padding: '12px 16px', 
                    border: '1px solid #d1d5db', 
                    borderLeft: 'none', 
                    borderRadius: '0 8px 8px 0', 
                    fontSize: '16px', 
                    color: '#6b7280' 
                  }}
                >
                  {formData.profilePicture ? formData.profilePicture.name : 'no file selected'}
                </span>
                <input
                  type="file"
                  id="profilePictureInput"
                  name="profilePicture"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '24px', 
            marginBottom: '32px' 
          }}>
            {/* Assigned State - Updated to a dropdown */}
            <div>
              <label 
                htmlFor="assignedState"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#111827' 
                }}
              >
                Assigned State:
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="assignedState"
                  name="assignedState"
                  value={formData.assignedState}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px', 
                    fontSize: '16px',
                    appearance: 'none',
                    backgroundColor: '#fff'
                  }}
                >
                  {stateOptions.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <FiChevronDown 
                  style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    pointerEvents: 'none',
                    color: '#6b7280'
                  }} 
                />
              </div>
            </div>

            {/* Assigned District */}
            <div>
              <label 
                htmlFor="assignedDistrict"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#111827' 
                }}
              >
                Assigned District:
              </label>
              <input
                type="text"
                id="assignedDistrict"
                name="assignedDistrict"
                value={formData.assignedDistrict}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  fontSize: '16px' 
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: '500', 
              cursor: 'pointer' 
            }}
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddViewUsers; 