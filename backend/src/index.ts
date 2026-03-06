import app from "./app";
import { PORT } from "./configs";
import { connectDB } from "./database/mongodb";
import http from "http";
import { initSocket } from "./realtime/socket";
import { startReportAutoResolveJob } from "./jobs/report-auto-resolve.job";

//server part
async function startServer(){
    await connectDB();
    startReportAutoResolveJob();
    const server = http.createServer(app);
    initSocket(server);

    server.listen(
        PORT,
        () =>{
            console.log(`Server: http://localhost:${PORT}`);
        }
    )
}

startServer();
