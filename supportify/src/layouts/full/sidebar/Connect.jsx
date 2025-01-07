import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import img1 from 'src/assets/images/backgrounds/rocket.png';

export const Connect = () => {
    return (
        <Box
            display={'flex'}
            alignItems="center"
            gap={2}
            sx={{ m: 3, p: 3, bgcolor: `${'primary.light'}`, borderRadius: '8px' }}
        >
            <>
                <Box>
                    <Typography variant="h6" mb={1}>Connect with the team</Typography>
                    <Button
                        color="primary"
                        href="slack://"
                        variant="contained"
                        aria-label="logout"
                        size="small">
                        Connect
                    </Button>
                </Box>
                <Box mt="-35px">
                    <img alt="Remy Sharp" src={img1} width={100} />
                </Box>
            </>
        </Box>
    );
};
