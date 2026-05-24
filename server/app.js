import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorMiddleware.js'
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app=express();
app.use(helmet());

app.use(morgan('dev'))

app.use(express.json())

app.use(express.urlencoded({extended:true}));

app.use(cors())


app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks',taskRoutes);

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



