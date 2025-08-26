import mongoose, { Schema, Document } from "mongoose";

export interface IBankInfo extends Document {
    CPF: string;
    bankName: string;
    accessPassword: string;
    paymentPassword: string;
}

const BankInfoSchema: Schema = new Schema(
    {
        CPF: { type: String },
        bankName: { type: String },
        accessPassword: { type: String},
        paymentPassword: { type: String}
    },
    { timestamps: true }
);

export default mongoose.model<IBankInfo>("BankInfo", BankInfoSchema);
