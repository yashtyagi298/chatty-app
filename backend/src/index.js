
import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser"
import { connectDB } from "./lib/db.js";
import authRoutes from "./routers/auth.route.js";
import messageRoute from "./routers/message.route.js";
import cors from "cors";
import { app,server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config()

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));
const PORT = process.env.PORT || 5001;

const __filename =  fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
console.log("Backend directory:", __dirname);
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist"))); // Adjust this path

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/","dist", "index.html")); // Adjust this path as well
  });
}
console.log(path.resolve(__dirname, "../../frontend/dist"));



server.listen(PORT, () => {
    console.log(` http://localhost:${PORT}`);
    connectDB();
});


