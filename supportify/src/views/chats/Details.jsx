import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useFrappeGetCall, useFrappeGetDoc, useFrappeUpdateDoc } from 'frappe-react-sdk';
import { useSelector } from 'react-redux';

const Details = ({ setRefreshSessionList }) => {
  // Initial values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);

  const sessionID = useSelector(
    (state) => state.currentSessionReducer.sessionID
  );

  const { data, error } = useFrappeGetDoc("Client Details", sessionID);
  const { updateDoc } = useFrappeUpdateDoc();

  // Fetch data from the API
  useEffect(() => {
    console.log("data details", data);
    if (data) {
      setName(data.name1 || '');
      setEmail(data.email_address || '');
      setContact(data.contact_number || '');
    }
  }, [data]);

  // Handle changes in the input fields
  const handleInputChange = (field, value) => {
    if (field === 'name') {
      setName(value);
      setIsNameValid(value.trim().length > 0);
    }
    if (field === 'email') {
      setEmail(value);
      setIsEmailValid(value.trim().length > 0 && /\S+@\S+\.\S+/.test(value));
    }
    if (field === 'contact') {
      setContact(value);
      setIsContactValid(value.trim().length > 0 && /^\d{10}$/.test(value));
    }
  };

  // Handle saving the fields
  const handleSave = (field) => {
    updateDoc(
      "Client Details",
      sessionID,
      {
        "name1": name,
        "contact_number": contact,
        "email_address": email
      }
    ).then(res => {
      switch (field) {
        case "name":
          setTimeout(() => {
            setRefreshSessionList(prev => !prev);
          }, 2000);
          setIsNameValid(false);
          break;
        case "email":
          setIsEmailValid(false);
          break;
        case "contact":
          setIsContactValid(false);
          break;
        default:
          break;
      }
    }).catch(err => {
      console.log("Error while updating the Client Details", err);
    });
    updateDoc("Session Details", sessionID, { "visitor_name": name });
  };

  return (
    <Box>
      <Box sx={{ padding: '0.9rem 1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Client Details</Typography>
      </Box>

      {/* Name Field */}
      <Box sx={{ display: 'flex', padding: '0.3rem' }}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          sx={{ marginRight: 1, '& .MuiInputBase-root': { height: '35px' } }}
        />
        <IconButton
          onClick={() => handleSave('name')}
          disabled={!isNameValid}
          sx={{ color: isNameValid ? 'green' : 'grey' }}
        >
          <CheckCircleIcon />
        </IconButton>
      </Box>

      {/* Email Field */}
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '0.3rem' }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          sx={{ marginRight: 1, '& .MuiInputBase-root': { height: '35px' } }}
        />
        <IconButton
          onClick={() => handleSave('email')}
          disabled={!isEmailValid}
          sx={{ color: isEmailValid ? 'green' : 'grey' }}
        >
          <CheckCircleIcon />
        </IconButton>
      </Box>

      {/* Contact Field */}
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '0.3rem' }}>
        <TextField
          label="Contact Number"
          variant="outlined"
          fullWidth
          value={contact}
          onChange={(e) => handleInputChange('contact', e.target.value)}
          sx={{ marginRight: 1, '& .MuiInputBase-root': { height: '35px' } }}
        />
        <IconButton
          onClick={() => handleSave('contact')}
          disabled={!isContactValid}
          sx={{ color: isContactValid ? 'green' : 'grey' }}
        >
          <CheckCircleIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Details;
