import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFrappePostCall } from 'frappe-react-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { setCannedMessages as setCannedMessagesAction } from '../../../../store/slices/AgentSlice';

export default function CannedMessages({ doctype }) {
  const [cannedMessages, setCannedMessages] = useState([]);
  const [disableSave, setDisableSave] = useState(true);
  const dispatch = useDispatch();

  const { call, result } = useFrappePostCall("ai_chat_assist.api.supportify.agent.add_canned_messages");
  const { call: getCannedMessages } = useFrappePostCall("ai_chat_assist.api.supportify.agent.get_canned_messages");

  const agent = useSelector((state) => state.agentReducer);
  let isAllowedToEdit = agent.isAdmin;
  
  if(doctype === 'personal') isAllowedToEdit = true;

  useEffect(() => {
    getCannedMessages({ doctype: doctype })
      .then((res) => {
        if (res.message.length === 0) {
          setDisableSave(true);
        }
        const formattedMessages = res.message.map(item => ({ hotWord: item.hot_word, message: item.message }));
        setCannedMessages(formattedMessages);
        dispatch(setCannedMessagesAction(formattedMessages));
      })
      .catch((err) => {
        console.error("Error fetching canned messages:", err);
      });
  }, [result, doctype]);

  const handleAddRow = () => {
    if (cannedMessages.length >= 10) {
      toast.error('You can only add up to 10 canned messages.');
      return;
    }
    setCannedMessages([...cannedMessages, { hotWord: '', message: '' }]);
    setDisableSave(false);
  };

  const handleRemoveRow = (index) => {
    const newCannedMessages = cannedMessages.filter((_, i) => i !== index);
    setCannedMessages(newCannedMessages);
    setDisableSave(false);
  };

  const handleChange = (index, field, value) => {
    const updatedMessages = cannedMessages.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setCannedMessages(updatedMessages);
    setDisableSave(false);
  };

  const handleSave = () => {
    let isValid = true;
    const validMessages = cannedMessages.filter(msg => {
      if (msg.hotWord.length < 3 || msg.hotWord.length > 8 || msg.hotWord.includes(' ')) {
        toast.error('Hot Word must be between 3 and 8 characters and cannot contain spaces.');
        isValid = false;
        return false;
      }
      if (msg.message.trim() === '') {
        toast.error('Message cannot be empty.');
        isValid = false;
        return false;
      }
      return true;
    });

    if (!isValid || validMessages.length === 0) return;

    call({ hot_word_and_messages: validMessages, doctype: doctype })
      .then((res) => {
        if (res.message === "success") {
          toast.success('Canned messages saved successfully!');
          setDisableSave(true);
        } else {
          toast.error('Failed to save canned messages.');
        }
      })
      .catch(() => {
        toast.error('Failed to save canned messages.');
      });
  };

  return (
    <Paper elevation={5} sx={{ padding: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        {doctype === "personal" ? "Personal" : "Team"} Canned Messages
      </Typography>
      {cannedMessages.map((item, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={5}>
              <TextField
                label="Hot Word"
                variant="outlined"
                value={item.hotWord}
                onChange={(e) => handleChange(index, 'hotWord', e.target.value)}
                inputProps={{ maxLength: 8 }}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Message"
                variant="outlined"
                value={item.message}
                onChange={(e) => handleChange(index, 'message', e.target.value)}
                multiline
                minRows={1}
                maxRows={4}
                required
                fullWidth
                sx={{ resize: 'vertical' }}
              />
            </Grid>
            {isAllowedToEdit && <Grid item xs={2}>
              <IconButton color="error" onClick={() => handleRemoveRow(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>}
          </Grid>
        </Box>
      ))}
      {isAllowedToEdit && <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, marginRight: 12 }}>
        <Button variant="contained" color="primary" onClick={handleAddRow} disabled={cannedMessages.length >= 10}>
          <AddIcon /> Add Row
        </Button>
        <Button variant="contained" color="success" onClick={handleSave} disabled={disableSave}>
          Save
        </Button>
      </Box>}
      <ToastContainer />
    </Paper>
  );
}
