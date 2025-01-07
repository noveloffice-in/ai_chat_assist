import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store/Store.js';
import { BrowserRouter } from 'react-router-dom';
import { FrappeProvider } from 'frappe-react-sdk';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

const frappeURL = import.meta.env.VITE_FRAPPE_URL;
const frappeSocket = import.meta.env.VITE_FRAPPE_SOCKET;
let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter basename='/supportify'>
          <FrappeProvider
            url={frappeURL}
            socketPort={frappeSocket}
          >
            <App />
          </FrappeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </Suspense>
);
