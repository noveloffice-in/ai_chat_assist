import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ showDialog, setShowDialog, title, message, buttonNameAndFunctions }) {

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            buttonNameAndFunctions.map((button) => {
              return (
                <Button onClick={button.function} color={button.color} variant={button.variant} >
                  {button.name}
                </Button>
              )
            })
          }
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
