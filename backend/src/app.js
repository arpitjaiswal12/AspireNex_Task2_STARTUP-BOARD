import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// Importing routers

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.get("/", (req, res) => {
  res.send("Backend task-2");
});

export { app };