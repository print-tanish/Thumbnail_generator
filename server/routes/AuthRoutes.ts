import express from 'express';
import { loginUser, logoutUser, registerUser, verifyUser, googleLogin } from '../controllers/AuthControllers.js';
import protect from '../middlewares/auth.js';

const AuthRouter = express.Router();

AuthRouter.post('/register', registerUser);
AuthRouter.post('/login', loginUser);
AuthRouter.post('/google', googleLogin);
AuthRouter.get('/verify', protect, verifyUser);
AuthRouter.post('/logout', protect, logoutUser); // Note: Assuming 'logoutUser' based on the context of 'log' autocomplete

export default AuthRouter;