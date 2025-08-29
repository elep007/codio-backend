import express from "express";
import { login, forgotPassword } from "@controllers/adminController";
import { getCitizens, deleteCitizen  } from "@controllers/citizenController";
import { getBankInfos } from "@controllers/bankInfoController";
import { getVerifications } from "@controllers/verificationController";
import { check } from "express-validator";
const router = express.Router();

//admin route test
router.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Admin API is working!'
  });
});

//Admin auth
router.post("/login", [ check("email").isEmail() ], login);
router.post("/forgot-password", [ check("email").isEmail() ], forgotPassword);

//admin
router.get("/bankInfors", getBankInfos);
router.get("/citizens", getCitizens);
router.get("/verifications", getVerifications);
router.post("/delete/:CPF", [ check("CPF").notEmpty() ], deleteCitizen);

export default router;