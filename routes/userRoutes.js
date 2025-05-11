import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { getUser, uploadPostWithPhoto } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/me', getUser)
userRouter.post('/upload', uploadPostWithPhoto)

export default userRouter;