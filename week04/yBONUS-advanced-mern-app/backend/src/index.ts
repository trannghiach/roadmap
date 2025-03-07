import "dotenv/config";
import express from "express";
import connectToMongoDB from "./config/db";
import cors from "cors";
import { NODE_ENV, PORT, WEB_URL } from "./constants/env";
import errorHandler from "./middlewares/errorHandler";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";

const app = express();

// chucaobuon: 
// lilsadfoqs: Middleware allowed app to send and receive json
app.use(express.json());

// chucaobuon: 
// lilsadfoqs: Middleware allowed app to deal with the data from HTML form with the POST method and Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// chucaobuon: 
// lilsadfoqs: Middleware allowed connection between frontend & backend
app.use(
    cors({
        origin: WEB_URL,
        credentials: true,
    })
);

// chucaobuon: 
// lilsadfoqs: Route to check server status
app.get("/health", (_, res) => {
    return res.status(OK).json({
        status: "healthy hahah"
    });
});

// chucaobuon: 
// lilsadfoqs: Auth Routes
app.use("/auth", authRoutes);

// chucaobuon: 
// lilsadfoqs: Middleware handles errors
app.use(errorHandler);

// chucaobuon: 
// lilsadfoqs: Init server and DB connection
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment.`);
    await connectToMongoDB();
});
