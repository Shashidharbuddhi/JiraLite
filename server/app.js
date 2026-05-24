import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorMiddleware.js'
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import rateLimit from 'express-rate-limit';

const app=express();

const authLimiter =
 rateLimit({
   windowMs:
     15 * 60 * 1000,

   max: 100,

   message:
     'Too many requests'
 });

app.use(helmet());

app.use(morgan('dev'))

app.use(express.json())

app.use(express.urlencoded({extended:true}));

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://jira-lite-one.vercel.app'
    ],
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS'
    ],
    credentials: true
  })
);


app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks',taskRoutes);
app.use('/api/activity',activityRoutes);
app.use('/api/auth',authLimiter,authRoutes);

app.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        message:"JiraLite api working"
    })
})

app.get('/error', (req, res) => {
  throw new Error('Test error');
});

app.use(errorHandler);


export default app;



