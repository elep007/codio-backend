import mongoose, { Schema, Document } from "mongoose";

export interface ICitizen extends Document {
    CPF: string;
    name: string;
    birthday: Date;
    motherName: string;
    phone: string;
    benefitNumber: string;
    status: "unverified" | "pending" | "verified" | "blocked";
}

const CitizenSchema: Schema = new Schema(
    {
        CPF: { type: String, unique: true},   //user data
        name: { type: String },
        birthday: { type: Date },
        motherName: { type: String},
        phone: {type: String, required: true },
        benefitNumber: { type: String },
        status: { type: String, enum: ["unverified", "pending", "verified", "blocked"], default: "unverified"}
    },
    { timestamps: true }
);

export default mongoose.model<ICitizen>("Citizen", CitizenSchema);
