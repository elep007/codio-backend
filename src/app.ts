import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
//import authRoutes from "./routes/authRoutes";
//import userRoutes from "./routes/userRoutes";
import citizenRoutes from "@routes/citizenRoutes"
import adminRoutes from "./routes/adminRoutes";
import { startMongoDB } from "modules/mongo/mongo.start";
import path from "path";

const app = express();

app.use(cors());
//app.use(express.json());
app.use(express.json({ limit: "10mb" }));

// Serve static files from the "public" directory
app.use("/photos", express.static(path.join(process.cwd(), "public", "uploads", "photos")));

//app.use("/api/auth", authRoutes);
app.use("/api", citizenRoutes);
app.use("/api/admin", adminRoutes);

startMongoDB();

export default app;
