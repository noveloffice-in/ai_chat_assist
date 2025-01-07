import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorImg from 'src/assets/images/backgrounds/404-error-idea.gif';
import ErrorAudio from 'src/assets/audio/error-sound.mp3';  // Adjust path based on your file location

const Error = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      <img src={ErrorImg} alt="404" style={{ width: '100%', maxWidth: '500px' }} />
      <Typography align="center" variant="h1" mb={4}>
        Opps!!!
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
        This page you are looking for could not be found.
      </Typography>
      <Button color="primary" variant="contained" component={Link} to="/" disableElevation>
        Go Back to Home
      </Button>
      
      {/* Audio Player */}
      <audio autoPlay loop>
        <source src={ErrorAudio} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </Container>
  </Box>
);

export default Error;
