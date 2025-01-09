import { configureStore } from '@reduxjs/toolkit';

// Import necessary functions and constants from redux-persist
import storage from 'redux-persist/lib/storage';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';

import AgentSlice from './slices/AgentSlice';
import CurrentSessionSlice from './slices//CurrentSessionSlice';

/**
 * Configuration for redux-persist.
 * @type {Object}
 * @property {string} key - The key for the persisted state in storage.
 * @property {number} version - The version of the persisted state.
 * @property {Object} storage - The storage engine to use (localStorage by default).
 */
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

/**
 * Combines all reducers into a single reducer function.
 * @type {Object}
 * @property {function} agentReducer - The reducer for managing project-related state.
 */
const reducer = combineReducers({
    agentReducer: AgentSlice,
    currentSessionReducer: CurrentSessionSlice,
});

/**
 * Creates a persisted reducer with the specified configuration.
 * @type {function} - A function that wraps the root reducer with persistence logic.
 */
const persistedReducer = persistReducer(persistConfig, reducer);

/**
 * Configures the Redux store with the persisted reducer and custom middleware.
 * @type {Object} - The Redux store.
 * @property {function} reducer - The root reducer, wrapped with persistence logic.
 * @property {function} middleware - Middleware configuration, including serializableCheck options.
 */
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions that may not be serializable
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;
