// Installed Utils
import express from 'express';

// App Utils
import { userMiddleware } from '../middlewares/AuthenticatedRequest';
import { userInfo } from '../controllers/userController';

// Init the route manager
const userRoute = express.Router();

// Supported routes
userRoute.get('/info', userMiddleware, userInfo);

export default userRoute;