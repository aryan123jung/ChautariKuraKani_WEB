import express, { Application } from 'express';
import { PORT } from './configs';
import dotenv from 'dotenv';
import { connect } from 'http2';
import { connectDB } from './database/mongodb';

dotenv.config();
console.log(process.env.PORT);

const app: Application = express();

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