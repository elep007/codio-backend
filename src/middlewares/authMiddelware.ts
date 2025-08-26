import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authMiddleware = (
	req: Request & { user?: any },
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ message: "No token provided" });

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch {
		res.status(401).json({ message: "Invalid token" });
	}
};

export const adminMiddleware = (
	req: Request & { user?: any },
	res: Response,
	next: NextFunction
) => {
	if (req.user?.role !== "admin")
		return res.status(403).json({ message: "Access denied" });
	next();
};
