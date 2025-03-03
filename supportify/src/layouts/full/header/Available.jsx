import { useCallback, useEffect, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { green, red } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { useFrappeGetDocList, useFrappeUpdateDoc } from 'frappe-react-sdk';
import { setAgentAvailability } from '../../../store/slices/AgentSlice';

export default function Available() {

    const agentDetails = useSelector((state) => state.agentReducer);
    const [available, setAvailable] = useState(agentDetails.isAvailable ? agentDetails.isAvailable : false);
    const dispatch = useDispatch();

    const { updateDoc } = useFrappeUpdateDoc();

    const updateAvailability = useCallback(
        debounce(async (status) => {
            updateDoc("Agent Profile", agentDetails.agentEmail, { is_available: status })
                .then((res) => {
                    dispatch(setAgentAvailability(status));
                })
                .catch((err) => {
                    console.log("Error = ", err);
                });
        }, 1000),
        []
    );

    useEffect(() => {
        setAvailable(agentDetails.isAvailable);
        updateAvailability(agentDetails.isAvailable);
    }, [agentDetails.isAvailable]);

    const GreenSwitch = styled(Switch)(({ theme }) => ({
        // Styles when checked (Green)
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: green["A400"],
            '&:hover': {
                backgroundColor: alpha(green["A400"], theme.palette.action.hoverOpacity),
            },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: green["A400"],
        },

        // Styles when unchecked (Red)
        '& .MuiSwitch-switchBase': {
            color: red["A400"],  // Red color when unchecked
            '&:hover': {
                backgroundColor: alpha(red["A400"], theme.palette.action.hoverOpacity), // Hover effect for red
            },
        },
        '& .MuiSwitch-switchBase + .MuiSwitch-track': {
            backgroundColor: red["A400"], // Track color for unchecked state
        },
    }));

    const label = { inputProps: { 'aria-label': 'Color switch demo' } };

    const handleCheck = (e) => {
        let status = e.target.checked ? 1 : 0;
        setAvailable(e.target.checked);
        dispatch(setAgentAvailability(status))
    }

    return (
        <>
            <label>Available</label>
            <GreenSwitch {...label} checked={available} onChange={handleCheck} />
        </>
    );
}
