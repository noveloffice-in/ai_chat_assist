import React, { useEffect, useState } from 'react';
import { 
  Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFrappeCreateDoc, useFrappeDeleteDoc, useFrappeGetDocList } from 'frappe-react-sdk';

export default function Tags() {
  const { data, isLoading, mutate } = useFrappeGetDocList('Tags', { fields: ['name', 'description'] });
  const { createDoc } = useFrappeCreateDoc();
  const { deleteDoc } = useFrappeDeleteDoc();

  const [tags, setTags] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTag, setNewTag] = useState({ name: '', description: '' });

  useEffect(() => {
    if (data) {
      setTags(data);
    }
  }, [data]);

  const handleChange = (e) => {
    setNewTag((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveTag = () => {
    if (!newTag.name.trim()) {
      toast.error('Tag name is required.');
      return;
    }
    
    if (newTag.name.includes(',')) {
      toast.error('Tag name should not contain comma(,).');
      return;
    }

    createDoc("Tags", { "tag": newTag.name, "description": newTag.description })
      .then((res) => {
        if (res && res.name) {
          toast.success('Tag added successfully!');
          setOpenDialog(false);
          mutate(); // Refresh data
          setNewTag({ name: '', description: '' }); // Reset input
        } else {
          toast.error('Failed to add tag.');
        }
      })
      .catch(() => {
        toast.error('Failed to add tag.');
      });
  };

  const handleDeleteTag = (name) => {
    deleteDoc("Tags", name)
      .then((res) => {
        if (res.data === 'ok') {
          toast.success('Tag deleted successfully!');
          mutate(); // Refresh data
        } else {
          toast.error('Failed to delete tag.');
        }
      })
      .catch(() => {
        toast.error('Failed to delete tag.');
      });
  };

  return (
    <Paper elevation={5} sx={{ padding: 1, borderRadius: 2 }}>
      {/* Add Tag Button - Moved to the right */}
      <Button 
        variant="contained" 
        color="primary" 
        size='small' 
        onClick={() => setOpenDialog(true)} 
        sx={{ float: 'right', marginBottom: 2 }}
      >
        <AddIcon /> Add Tag
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Tag</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Delete</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <TableRow key={tag.name}>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.description}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDeleteTag(tag.name)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  {isLoading ? 'Loading...' : 'No tags found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Custom Dialog for Adding a Tag */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Tag</DialogTitle>
        <DialogContent>
          <TextField
            label="Tag Name"
            name="name"
            variant="outlined"
            fullWidth
            value={newTag.name}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2, marginTop: 1 }}
          />
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            fullWidth
            value={newTag.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleSaveTag} color="success" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Paper>
  );
}
