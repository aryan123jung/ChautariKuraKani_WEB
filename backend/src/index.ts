import express, { Application } from 'express';
import { PORT } from './configs';
import dotenv from 'dotenv';
import { connect } from 'http2';
import { connectDB } from './database/mongodb';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes';
import adminUserRoutes from './routes/admin/user.route';
import cors from 'cors';

dotenv.config();
console.log(process.env.PORT);

const app: Application = express();

let corsOptions = {
    origin: ['http://localhost:3000']
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin/users',adminUserRoutes);



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