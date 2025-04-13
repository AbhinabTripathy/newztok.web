import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import axios from 'axios';

const AddViewUsers = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'journalist',
    phoneNumber: '',
    profilePicture: null,
    assignedState: 'बिहार | Bihar',
    assignedDistrict: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [availableDistricts, setAvailableDistricts] = useState([]);

  // Role options
  const roleOptions = [
    { value: 'journalist', label: 'Journalist' }
  ];

  // API Base URL
  const baseURL = 'http://13.234.42.114:3333';

  // State options as shown in the image
  const stateOptions = [
    'बिहार | Bihar',
    'उत्तर प्रदेश | Uttar Pradesh',
    'झारखंड | Jharkhand'
  ];

  // District data for each state
  const districtData = {
    jharkhand: [
      { hindi: "रांची", english: "Ranchi" },
      { hindi: "जमशेदपुर", english: "Jamshedpur" },
      { hindi: "धनबाद", english: "Dhanbad" },
      { hindi: "बोकारो", english: "Bokaro" },
      { hindi: "देवघर", english: "Deoghar" },
      { hindi: "हजारीबाग", english: "Hazaribagh" },
      { hindi: "गिरिडीह", english: "Giridih" },
      { hindi: "कोडरमा", english: "Koderma" },
      { hindi: "चतरा", english: "Chatra" },
      { hindi: "गुमला", english: "Gumla" },
      { hindi: "लातेहार", english: "Latehar" },
      { hindi: "लोहरदगा", english: "Lohardaga" },
      { hindi: "पाकुड़", english: "Pakur" },
      { hindi: "पलामू", english: "Palamu" },
      { hindi: "रामगढ़", english: "Ramgarh" },
      { hindi: "साहिबगंज", english: "Sahibganj" },
      { hindi: "सिमडेगा", english: "Simdega" },
      { hindi: "सिंहभूम", english: "Singhbhum" },
      { hindi: "सरायकेला खरसावां", english: "Seraikela Kharsawan" },
      { hindi: "पूर्वी सिंहभूम", english: "East Singhbhum" },
      { hindi: "पश्चिमी सिंहभूम", english: "West Singhbhum" }
    ],
    bihar: [
      { hindi: "पटना", english: "Patna" },
      { hindi: "गया", english: "Gaya" },
      { hindi: "मुंगेर", english: "Munger" },
      { hindi: "भागलपुर", english: "Bhagalpur" },
      { hindi: "पूर्णिया", english: "Purnia" },
      { hindi: "दरभंगा", english: "Darbhanga" },
      { hindi: "मुजफ्फरपुर", english: "Muzaffarpur" },
      { hindi: "सहरसा", english: "Saharsa" },
      { hindi: "सीतामढ़ी", english: "Sitamarhi" },
      { hindi: "वैशाली", english: "Vaishali" },
      { hindi: "सिवान", english: "Siwan" },
      { hindi: "सारण", english: "Saran" },
      { hindi: "गोपालगंज", english: "Gopalganj" },
      { hindi: "बेगूसराय", english: "Begusarai" },
      { hindi: "समस्तीपुर", english: "Samastipur" },
      { hindi: "मधुबनी", english: "Madhubani" },
      { hindi: "सुपौल", english: "Supaul" },
      { hindi: "अररिया", english: "Araria" },
      { hindi: "किशनगंज", english: "Kishanganj" },
      { hindi: "कटिहार", english: "Katihar" },
      { hindi: "पूर्वी चंपारण", english: "East Champaran" },
      { hindi: "पश्चिमी चंपारण", english: "West Champaran" },
      { hindi: "शिवहर", english: "Sheohar" },
      { hindi: "मधेपुरा", english: "Madhepura" }
    ],
    "uttar pradesh": [
      { hindi: "लखनऊ", english: "Lucknow" },
      { hindi: "कानपुर", english: "Kanpur" },
      { hindi: "आगरा", english: "Agra" },
      { hindi: "वाराणसी", english: "Varanasi" },
      { hindi: "प्रयागराज", english: "Prayagraj" },
      { hindi: "मेरठ", english: "Meerut" },
      { hindi: "नोएडा", english: "Noida" },
      { hindi: "गाजियाबाद", english: "Ghaziabad" },
      { hindi: "बरेली", english: "Bareilly" },
      { hindi: "अलीगढ़", english: "Aligarh" },
      { hindi: "मुरादाबाद", english: "Moradabad" },
      { hindi: "सहारनपुर", english: "Saharanpur" },
      { hindi: "गोरखपुर", english: "Gorakhpur" },
      { hindi: "फैजाबाद", english: "Faizabad" },
      { hindi: "जौनपुर", english: "Jaunpur" },
      { hindi: "मथुरा", english: "Mathura" },
      { hindi: "बलिया", english: "Ballia" },
      { hindi: "रायबरेली", english: "Rae Bareli" },
      { hindi: "सुल्तानपुर", english: "Sultanpur" },
      { hindi: "फतेहपुर", english: "Fatehpur" },
      { hindi: "प्रतापगढ़", english: "Pratapgarh" },
      { hindi: "कौशाम्बी", english: "Kaushambi" },
      { hindi: "झांसी", english: "Jhansi" },
      { hindi: "ललितपुर", english: "Lalitpur" }
    ]
  };

  // Update available districts when state changes
  useEffect(() => {
    const updateDistricts = () => {
      const stateName = formData.assignedState.toLowerCase();
      let stateKey = "";
      
      if (stateName.includes("बिहार") || stateName.includes("bihar")) {
        stateKey = "bihar";
      } else if (stateName.includes("उत्तर प्रदेश") || stateName.includes("uttar pradesh")) {
        stateKey = "uttar pradesh";
      } else if (stateName.includes("झारखंड") || stateName.includes("jharkhand")) {
        stateKey = "jharkhand";
      }
      
      setAvailableDistricts(districtData[stateKey] || []);
      // Reset district selection when state changes
      setFormData(prev => ({ ...prev, assignedDistrict: '' }));
    };
    
    updateDistricts();
  }, [formData.assignedState]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    try {
      // Get the auth token
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirmPassword', formData.confirmPassword);
      formDataToSend.append('mobile', formData.phoneNumber);
      
      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }
      
      // Extract state and district based on format
      const state = formData.assignedState.split('|')[1]?.trim() || formData.assignedState;
      const district = formData.assignedDistrict.split('|')[1]?.trim() || formData.assignedDistrict;
      
      formDataToSend.append('assignState', state);
      formDataToSend.append('assignDistrict', district);
      
      // Configure axios headers with the token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      };
      
      // Send the request to create journalist
      const response = await axios.post(`${baseURL}/api/auth/create-journalist`, formDataToSend, config);
      
      console.log('Journalist created successfully:', response.data);
      setSuccess('Journalist created successfully!');
      
      // Reset form after submission
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'journalist',
        phoneNumber: '',
        profilePicture: null,
        assignedState: 'बिहार | Bihar',
        assignedDistrict: ''
      });
      
    } catch (err) {
      console.error('Error creating journalist:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 'Failed to create journalist. Please try again.');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToProfile = () => {
    navigate('/editor/users');
  };

  // Format district for display
  const formatDistrict = (district) => {
    return `${district.hindi} | ${district.english}`;
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

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            backgroundColor: '#d1fae5', 
            color: '#047857', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            {success}
          </div>
        )}

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
                required
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
                required
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
                required
              />
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '24px', 
            marginBottom: '24px' 
          }}>
            {/* Role - Updated to dropdown */}
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
              <div style={{ position: 'relative' }}>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
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
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
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

            {/* Assigned District - Updated to a dynamic dropdown */}
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
              <div style={{ position: 'relative' }}>
                <select
                  id="assignedDistrict"
                  name="assignedDistrict"
                  value={formData.assignedDistrict}
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
                  <option value="">Select District</option>
                  {availableDistricts.map((district, index) => (
                    <option key={index} value={formatDistrict(district)}>
                      {formatDistrict(district)}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              backgroundColor: loading ? '#93c5fd' : '#3b82f6', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: '500', 
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? 'Creating User...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddViewUsers; 