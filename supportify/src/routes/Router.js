import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Protected from './Protected';
import AgentProfile from './AgentProfile';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const MessagesLayout = Loadable(lazy(() => import('../views/chats/MessagesLayout')));
const SettingsLayout = Loadable(lazy(() => import('../views/settings/SettingsLayout')));

// import LoginPage from 'src/devComponents/login/LoginPage';

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <AgentProfile Component={Dashboard} /> },
      { path: '/messages', exact: true, element: <Protected Component={MessagesLayout} /> },
      { path: '/settings', exact: true, element: <Protected Component={SettingsLayout} /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
