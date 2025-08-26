import { Request, Response } from "express";
// import Admin from "../models/Admin";
import Admin from "@models/Admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Login
export const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { email, password } = req.body;

        const user = await Admin.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        if(user.role != "admin"){
            return res.status(403).json({ message: "Access denied"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({
            token,
            user: {
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Forgot Password (set resetToken)
export const forgotPassword = async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const { email } = req.body;
        const user = await Admin.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1d",
        });
        user.resetToken = resetToken;
        await user.save();

        // TODO: Send email with resetToken link
        res.json({ message: "Password reset link sent", resetToken });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
