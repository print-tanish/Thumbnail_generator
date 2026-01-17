import { createRoot } from 'react-dom/client'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

// IMPORTANT: Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "1043649488324-jn9abhtv9cg1i0lvho3h4v8urmqconda.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </GoogleOAuthProvider>,
)