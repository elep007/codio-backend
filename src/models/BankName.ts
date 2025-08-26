import mongoose, { Schema, Document } from "mongoose";

export interface IBankName extends Document {
    bank_id: string;
    bankName: string;
}

const BankNameSchema: Schema = new Schema(
    {
        bank_id: { type: String, unique: true },
        bankName: { type: String }
    },
    { timestamps: false }
);

export default mongoose.model<IBankName>("BankName", BankNameSchema);
