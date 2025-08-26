import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
    email: string;
    password: string;
    role: "admin" | "user";
    resetToken?: string;
}

const AdminSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },   //user
        resetToken: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IAdmin>("Admin", AdminSchema);
