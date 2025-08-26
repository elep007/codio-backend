import { Request, Response } from "express";
import Citizen from "../models/Citizen";
import Verification from "@models/Verification";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs"

// Get all bankinfo (Admin only)
export const getVerifications = async (req: Request, res: Response) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
        
    try {
        const verifications = await Verification.find();
        res.json(verifications);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const sendVerification = async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { CPF, date, photo, bookingTime, ip, device } = req.body;
    try{
        let citizen = await Citizen.findOne({ CPF });
        if(!citizen){
            return res.status(400).json({ message: "Citizen not found"});
        }
        
        let verification = new Verification({
            CPF, date, bookingTime, ip, device 
        });

        //image upload handler
        const uploadPath = path.join(process.cwd(), 'public', "uploads",'photos');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }

        // The Base64 string is usually preceded by a header. We need to remove it.
        //const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
        const base64Data = photo.replace(/^data:image\/webp;base64,/, "");



        // Create a buffer from the Base64 string
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Generate a unique filename (e.g., using a timestamp)
        const filename = `photo-${Date.now()}.webp`;
        const filePath = path.join(uploadPath, filename);

        // Save the buffer to a file
        fs.writeFileSync(filePath, imageBuffer);

        verification.photo = filename;
        await verification.save();

        res.status(201).json({ message: "Successfully sent" })
    }
    catch(error){
        res.status(500).json({ message: "server error" });
    }
}

export const bookVerification = async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const vid  = req.params.verification_id;
        const verification = await Verification.findById(vid);

        if(!verification) return res.status(404).json({ message: "Verification not found"});

        verification.bookingTime = req.body.bookingTime;
        verification.save();

        res.status(200).json({ message: "Updated successfully" });
    }
    catch(error){
        res.status(500).json({ error: "Failed to fetch verifiation" });
    }
}