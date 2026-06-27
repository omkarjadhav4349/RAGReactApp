import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
    /^http:\/\/localhost:\d+$/,
    /^http:\/\/127\.0\.0\.1:\d+$/,
];

app.use(cors({
    origin(origin, callback) {
        if (!origin) {
            return callback(null, true);
        }

        const isAllowed = allowedOrigins.some((pattern) =>
            pattern.test(origin),
        );

        return callback(isAllowed ? null : new Error("CORS blocked"), isAllowed);
    },
    methods: ["GET", "POST", "OPTIONS"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "RAG backend running"
    });
});

app.use("/upload", uploadRoutes);
app.use("/chat", chatRoutes);

export default app;
