import mongoose, { Schema, Document } from "mongoose";

export interface IVerification extends Document {
    CPF: string;
    date : Date;
    photo: string;
    bookingTime: Date;
    device: "unknown" | "Android" | "iOS" | "desktop" ;
    ip: string;
}

const VerificationSchema: Schema = new Schema(
    {
        CPF: { type: String },
        date : { type: Date},				//verify
        photo: { type: String },    				
        bookingTime: { type: Date },
        device: { type: String, enum: ["unknown" ,"Android", "iOS", "desktop"], default: "unknown"},
        ip: { type: String }
    },
    { timestamps: true }
);

export default mongoose.model<IVerification>("Verification", VerificationSchema);
