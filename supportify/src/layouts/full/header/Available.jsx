import { useCallback, useEffect, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { green, red } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { useFrappeGetDocList, useFrappeUpdateDoc } from 'frappe-react-sdk';
import { setAgentAvailability } from '../../../store/slices/AgentSlice';

export default function Available() {

    const [available, setAvailable] = useState(false);
    const agentDetals = useSelector((state) => state.agentReducer);
    const dispatch = useDispatch();

    const {updateDoc} = useFrappeUpdateDoc();
    const { data, error } = useFrappeGetDocList("Agent Profile", { filters: [["name", "=", agentDetals.agentEmail]], fields: ["is_available"] })
    console.log("Data", data);
    const updateAvailability = useCallback(
        debounce(async (status) => {
            updateDoc("Agent Profile", agentDetals.agentEmail, {is_available : status})
            .then((res)=>{
                console.log("res = ", res);
            })
            .catch((err)=>{
                console.log("Error = ", err);
            })
            console.log("Updating API with status:", status);
        }, 1000),
        []
    );

    useEffect(() => {
        let status = data && data[0].is_available === 0 ? false : true;
        setAvailable(status);
        dispatch(setAgentAvailability(status));
    }, [data]);

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
        let status =  e.target.checked ? 1 : 0;
        setAvailable(e.target.checked);
        updateAvailability(status);
    }

    return (
        <GreenSwitch {...label} checked={available} onChange={handleCheck} />
    );
}
