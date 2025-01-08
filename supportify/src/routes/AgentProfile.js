import { useFrappeAuth, useFrappeCreateDoc, useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setAgentAdminStatus, setAgentAvailability, setAgentEmail, setAgentName } from '../store/slices/AgentSlice';

export default function AgentProfile(props) {
    const { Component } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentUser, getUserCookie } = useFrappeAuth();
    let c = Cookies.set(getUserCookie);

    // Getting the user details using cookies
    useEffect(() => {
        const handleBackButton = (event) => {
            if (Cookies.get('user_id') !== 'Guest') {
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        };

        if (Cookies.get('user_id') !== 'Guest') {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }

        window.addEventListener('popstate', handleBackButton);

        // Cleanup when component unmounts
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, []);

    const {call} = useFrappePostCall('ai_chat_assist.api.supportify.agent.check_agent');

    useEffect(() => {
        if(currentUser){
            call({"user" : currentUser})
            .then((res)=>{
                let agent = res.message;
                
                dispatch(setAgentName(agent.agent_name));
                dispatch(setAgentEmail(agent.user));
                dispatch(setAgentAdminStatus(agent.is_admin));
                dispatch(setAgentAvailability(agent.is_available));
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    }, [currentUser]);

    return <Component />;
}
