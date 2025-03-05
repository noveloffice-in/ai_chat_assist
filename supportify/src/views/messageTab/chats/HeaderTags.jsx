import { useState, useRef, useEffect } from 'react';
import { Stack, Typography, Chip, useMediaQuery, useTheme, Menu, MenuItem, Popper, Paper } from '@mui/material';
import { blue, red, green, purple, orange } from '@mui/material/colors';
import { useFrappeGetDocList, useFrappeUpdateDoc } from 'frappe-react-sdk';

export default function HeaderTags({ data }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const wrapperRef = useRef(null);
    const popperRef = useRef(null);

    const { data: allTagsRaw } = useFrappeGetDocList("Tags", { fields: ["name"] });
    const colors = [blue[500], red[500], green[500], purple[500], orange[500]];
    const { updateDoc } = useFrappeUpdateDoc();

    const [tags, setTags] = useState([]);
    console.log("Tags", tags);
    const [showHiddenTags, setShowHiddenTags] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [tooltipTag, setTooltipTag] = useState(null);
    const [tooltipAnchor, setTooltipAnchor] = useState(null);

    // Filter available tags to exclude those already assigned
    const availableTags = allTagsRaw?.map(tag => tag.name).filter(tag => !tags.includes(tag)) || [];

    const visibleCount = isMobile ? 2 : 4;
    const visibleTags = tags.slice(0, visibleCount);
    const hiddenTags = tags.slice(visibleCount);
    const remainingCount = hiddenTags.length;

    const handleDelete = (tag) => {
        const updatedTags = tags.filter(t => t !== tag);
        setTags(updatedTags);
        assignTagsAPI(updatedTags);
    };

    const handleAddTag = (tag) => {
        if (!tags.includes(tag)) {
            const updatedTags = [...tags, tag];
            setTags(updatedTags);
            assignTagsAPI(updatedTags);
        }
        setAnchorEl(null);
    };

    const assignTagsAPI = async (updatedTags) => {
        try {
            await updateDoc("Session Details", data.name, { "tags": updatedTags.join(',') });
        } catch (error) {
            console.error('Error updating tags:', error);
        }
    };

    // Close hidden tags and tooltip when clicking outside
    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowHiddenTags(false);
        }
        if (popperRef.current && !popperRef.current.contains(event.target)) {
            setTooltipTag(null);
        }
    };

    useEffect(() => {
        setTags(data.tags ? data.tags.split(',').filter(Boolean) : []);
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [data]);

    return (
        <Stack ref={wrapperRef} padding={0.5} sx={{ borderBottom: '1px solid #ddd' }} flexDirection="row" gap={1} flexWrap="wrap">
            {/* Tag Conversation Button */}
            <Typography
                color={blue[600]}
                sx={{
                    textDecoration: 'underline',
                    fontSize: '0.8rem',
                    padding: '0.2rem 0',
                    marginLeft: '0.5rem',
                    cursor: 'pointer',
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                Tag Conversation
            </Typography>

            {/* Dropdown Menu for Adding Tags */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    sx: {
                        maxHeight: 200, // Limits height to 200px (~5 items)
                        overflowY: 'auto', // Enables scrolling
                    },
                }}
            >
                {availableTags.map((tag) => (
                    <MenuItem key={tag} onClick={() => handleAddTag(tag)}>
                        {tag}
                    </MenuItem>
                ))}
            </Menu>

            {/* Visible Tags */}
            <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                {visibleTags.map((tag, index) => (
                    <Chip
                        key={tag}
                        label={tag.length > 5 ? `${tag.substring(0, 5)}...` : tag}
                        onDelete={() => handleDelete(tag)}
                        onClick={(e) => {
                            setTooltipTag(tooltipTag === tag ? null : tag);
                            setTooltipAnchor(e.currentTarget);
                        }}
                        sx={{
                            borderColor: colors[index % colors.length],
                            color: colors[index % colors.length],
                            fontSize: '0.75rem',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                        }}
                        variant="outlined"
                        size="small"
                    />
                ))}

                {/* Hidden Tags - Toggle Visibility */}
                {showHiddenTags &&
                    hiddenTags.map((tag, index) => (
                        <Chip
                            key={tag}
                            label={tag.length > 5 ? `${tag.substring(0, 5)}...` : tag}
                            onDelete={() => handleDelete(tag)}
                            onClick={(e) => {
                                setTooltipTag(tooltipTag === tag ? null : tag);
                                setTooltipAnchor(e.currentTarget);
                            }}
                            sx={{
                                borderColor: colors[(visibleCount + index) % colors.length],
                                color: colors[(visibleCount + index) % colors.length],
                                fontSize: '0.75rem',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                            }}
                            variant="outlined"
                            size="small"
                        />
                    ))}

                {/* Show Hidden Tags on Click */}
                {remainingCount > 0 && (
                    <Chip
                        label={showHiddenTags ? 'Hide' : `+${remainingCount} more`}
                        onClick={() => setShowHiddenTags(!showHiddenTags)}
                        sx={{
                            borderColor: '#888',
                            color: '#888',
                            fontSize: '0.75rem',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                        }}
                        variant="outlined"
                        size="small"
                    />
                )}
            </Stack>

            {/* Clickable Tooltip */}
            <Popper open={Boolean(tooltipTag)} anchorEl={tooltipAnchor} placement="top" sx={{ zIndex: '10' }}>
                <Paper ref={popperRef} sx={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: '#333', color: '#fff' }}>
                    {tooltipTag}
                </Paper>
            </Popper>
        </Stack>
    );
}
