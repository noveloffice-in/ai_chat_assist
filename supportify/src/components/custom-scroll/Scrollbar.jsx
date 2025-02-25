import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { Box, styled } from '@mui/material';

/**
 * Styled SimpleBar component with custom scrollbar styles.
 */
const SimpleBarStyle = styled(SimpleBar)(() => ({
    maxHeight: '100%',
    '.simplebar-scrollbar:before': { backgroundColor: '#2e2d348f' },
}));


/**
 * Scrollbar component that conditionally uses SimpleBar for desktop and a fallback for mobile.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered within the Scrollbar.
 * @param {Object} [props.sx] - Additional styles to be applied to the SimpleBar component.
 * @param {Object} [props.other] - Any other props to be passed to the SimpleBar component.
 * 
 * @returns {JSX.Element} The rendered Scrollbar component.
 */
const Scrollbar = (props) => {
    const { children, sx, ...other } = props;

    // Detect if the user agent is a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Render a Box with overflowX: auto for mobile devices
    if (isMobile) {
        return <Box sx={{ overflowX: 'auto' }}>{children}</Box>;
    }

    // Render the SimpleBar component with custom styles for non-mobile devices
    return (
        <SimpleBarStyle sx={sx} {...other}>
            {children}
        </SimpleBarStyle>
    );
};

// Define the prop types for the Scrollbar component
Scrollbar.propTypes = {
    /** The content to be rendered within the Scrollbar. */
    children: PropTypes.node,

    /** Additional styles to be applied to the SimpleBar component. */
    sx: PropTypes.object,

    /** Any other props to be passed to the SimpleBar component. */
    other: PropTypes.any,
};

export default Scrollbar;
