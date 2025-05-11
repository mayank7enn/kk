import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import moduleRouter from './routes/moduleRoutes.js';
// import { userAuth } from './middleware/userAuth.js';
import { connectDB } from './models/config/config.models.js';
import userRouter from './routes/userRoutes.js';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });
const app = express();
const Port = process.env.PORT || 5000;
connectDB();

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('This is the basic home page where we would implement all the basic operations for the authentication and authorisation of the user')
})
app.use('/api/auth', authRouter)
app.use('/api/module', moduleRouter)
app.use('/api/user', userRouter) // Assuming you have a userRouter defined

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});