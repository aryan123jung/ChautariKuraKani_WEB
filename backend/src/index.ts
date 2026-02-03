import app from "./app";
import { PORT } from "./configs";
import { connectDB } from "./database/mongodb";

//server part
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