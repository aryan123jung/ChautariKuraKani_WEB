import { connectDB } from "../database/mongodb";
import mongoose from "mongoose";

// before all test starts
beforeAll(async () => {
    if (process.env.SKIP_DB_CONNECT === "true") {
        return;
    }
    //can connect to test database or other test engines
    await connectDB();
});

// after all tests are done
afterAll(async () => {
    if (process.env.SKIP_DB_CONNECT === "true") {
        return;
    }
    await mongoose.connection.close();
});
