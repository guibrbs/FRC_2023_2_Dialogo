import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { MeetScreen } from './pages/MeetScreen';
import { CamPreviewContextProvider } from './contexts/CamPreviewContext';
import { App } from './App';
import { WebsocketConnectionContextProvider } from './contexts/WebsocketConnectionContext';
import { UserContextProdiver } from './contexts/UserContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/meet",
    element: <MeetScreen />
  }
])
root.render(
  <React.StrictMode>
    <CamPreviewContextProvider>
      <WebsocketConnectionContextProvider>
        <UserContextProdiver>
          <App>
            <RouterProvider router={router} />
          </App>
        </UserContextProdiver>
      </WebsocketConnectionContextProvider>
    </CamPreviewContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
