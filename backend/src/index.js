
import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser"
import { connectDB } from "./lib/db.js";
import authRoutes from "./routers/auth.route.js";
import messageRoute from "./routers/message.route.js";
import cors from "cors";
import { app,server } from "./lib/socket.js";
import path from "path";

dotenv.config()

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));
const PORT = process.env.PORT;
const _dirname=path.resolve();

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(_dirname, "../../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
    console.log(` http://localhost:${PORT}`);
    connectDB();
});


