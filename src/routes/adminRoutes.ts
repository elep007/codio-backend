import express from "express";
import { login, forgotPassword } from "../controllers/adminController";
import { getCitizens, deleteCitizen  } from "@controllers/citizenController";
import { getBankInfos } from "@controllers/bankInfoController";
import { getVerifications } from "@controllers/verificationController";
import { check } from "express-validator";
const router = express.Router();

//Admin auth
router.post("/login", [ check("email").isEmail , check("password").isLength({ min: 8 }) ], login);
router.post("/forgot-password", [ check("email").isEmail ], forgotPassword);

//admin
router.get("/bankInfors", getBankInfos);
router.get("/citizens", getCitizens);
router.get("/verifications", getVerifications);
router.post("/delete/:CPF", [ check("CPF").notEmpty() ], deleteCitizen);

export default router;