import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import Router from './routes/Rout.jsx'
import store from './redux/admin/store.jsx'
import {Provider} from "react-redux"
import { GoogleOAuthProvider } from '@react-oauth/google'
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <GoogleOAuthProvider clientId="533398179756-ng58rv2t1fo8f4gjjbng6kfutg2tqruh.apps.googleusercontent.com">
    <Provider store={store}> 
      <RouterProvider router={Router} />
    </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
)
