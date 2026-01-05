import express, { Application } from 'express';
import { PORT } from './configs';
import dotenv from 'dotenv';
import { connect } from 'http2';
import { connectDB } from './database/mongodb';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes';

dotenv.config();
console.log(process.env.PORT);

const app: Application = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);



async function startServer(){
    await connectDB();

    app.listen(
        PORT,
        () =>{
            console.log(`Server: http://localhost:${PORT}`);
        }
    )
}

startServer();