import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Button, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useFrappeGetCall, useFrappeGetDoc, useFrappeUpdateDoc } from 'frappe-react-sdk';
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Client Details component for displaying and editing client information.
 * 
 * @param {Object} props - Component props.
 * @param {Function} props.setRefreshSessionList - Function to refresh the session list.
 * @param {Function} props.setView - Function to set the current view.
 * @param {boolean} props.isDesktop - Flag indicating if the view is desktop.
 */
const Details = ({ setRefreshSessionList, setView, isDesktop }) => {
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

  const { data } = useFrappeGetDoc("Client Details", sessionID);
  const { updateDoc } = useFrappeUpdateDoc();

  // Fetch data from the API
  useEffect(() => {
    if (data) {
      setName(data.name1 || '');
      setEmail(data.email_address || '');
      setContact(data.contact_number || '');
    }
  }, [data]);

  console.log(sessionID)

  /**
   * Handle changes in the input fields.
   * 
   * @param {string} field - The field being updated ('name', 'email', or 'contact').
   * @param {string} value - The new value for the field.
   */
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'name':
        setName(value);
        setIsNameValid(value.trim().length > 0);
        break;
      case 'email':
        setEmail(value);
        setIsEmailValid(value.trim().length > 0 && /\S+@\S+\.\S+/.test(value));
        break;
      case 'contact':
        setContact(value);
        setIsContactValid(value.trim().length > 0 && /^\d{10}$/.test(value));
        break;
      default:
        break;
    }
  };

  /**
   * Handle saving the fields.
   * 
   * @param {string} field - The field being saved ('name', 'email', or 'contact').
   */
  const handleSave = (field) => {
    const clientDetails = {
      "name1": name,
      "contact_number": contact,
      "email_address": email
    };

    updateDoc("Client Details", sessionID, clientDetails)
      .then(() => {
        if (field === "name") {
          setTimeout(() => {
            setRefreshSessionList(prev => !prev);
          }, 2000);
          setIsNameValid(false);
        } else if (field === "email") {
          setIsEmailValid(false);
        } else if (field === "contact") {
          setIsContactValid(false);
        }
      })
      .catch(err => {
        console.log("Error while updating the Client Details", err);
      });

    updateDoc("Session Details", sessionID, { "visitor_name": name });
  };

  return (
    <Box>
      <Box sx={{ padding: '0.9rem 1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        {!isDesktop && <ArrowBackIcon onClick={() => setView("chat")} />}
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

      {/* Referrer link */}
      <Box>
        <Card>
          <CardContent>
            <Typography variant='subtitle1'>
              Client Referrer
            </Typography>
            <Typography variant="h6" component="div">
              {data?.referrer ? data.referrer : "No referrer link found"}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Details;
