import express, { Application,Request,Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes';
import adminUserRoutes from './routes/admin/user.route';
import cors from 'cors';
import path from "path";
import { HttpError } from './errors/http-error';
import postRoutes from './routes/post.routes';
import friendRequestRoutes from './routes/friend-request.routes';
import notificationRoutes from './routes/notification.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();
console.log(process.env.PORT);

const app: Application = express();

let corsOptions = {
    origin: ['http://localhost:3000']
}

//application part
app.use("/uploads",express.static(path.join(__dirname,'../uploads')));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin/users',adminUserRoutes);
app.use('/api/post',postRoutes)
app.use('/api/friends', friendRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);


app.use((err: Error, req: Request, res: Response, next: Function) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

export default app;
