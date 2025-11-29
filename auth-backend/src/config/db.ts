import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri: string = process.env.MONGO_URI || "";

const connectDB = async () => {
    try {
        const conn = mongoose.connect(uri);
        console.log("Mongo DB connected...");
    } catch (error) {
        console.error("Failed to connect Mongo DB:", error);
    }
}

export default connectDB;