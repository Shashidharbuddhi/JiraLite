import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorMiddleware.js'


const app=express();

app.use(errorHandler);

app.use(helmet());

app.use(morgan('dev'))

app.use(express.json())

app.use(cors())

app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        message:"JiraLite api working"
    })
})

app.get('/error', (req, res) => {
  throw new Error('Test error');
});


export default app;




