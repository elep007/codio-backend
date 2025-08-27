import { Request, Response } from "express";
import Citizen from "../models/Citizen";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import axios from "axios"

// Get all users (Admin only)
export const getCitizens = async (req: Request, res: Response) => {
	
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
        
    try {
        const citizens = await Citizen.find();
        res.json(citizens);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const getAPIdata = async(cpf: String) => {
    
    const thirdPartyUrl = 'https://agendarprovadevida.org/inss-api/';

    try {
        // Make the GET request to the third-party API
        const response = await axios.get(thirdPartyUrl + "?cpf=" + cpf);
        
        // The data is in response.data
        const data = response.data;

        if (data.resultado == "DADOS NAO LOCALIZADOS") {
            return false;
        }
        else {
            const result = data.resultado;
            const phone = result.telefones.join(", ") || "";
            const name = result.nome;
            const benefitNumber = result.numero_beneficio;
            const motherName = result.motherName || "";
            let  birthday = result.nascimento;
                const year = birthday.substring(0, 4);
                const month = birthday.substring(4, 6);
                const day = birthday.substring(6, 8);
    
                // Create a new Date object using a standard format (YYYY-MM-DD)
                birthday = `${year}-${month}-${day}`;

            const res = {
                "CPF": cpf,
                "name": name,
                "birthday": birthday,
                "benefitNumber": benefitNumber,
                "motherName": motherName,
                "phone": phone
            };

            return res;
        }
    } catch (error) {
        return false;
    }
}

export const getCitizenData = async(req: Request, res: Response) => {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
    try {
        const cpf = req.params.CPF;
        const apidata = await getAPIdata(cpf);
        if(apidata){
            res.status(200).json(apidata);    
        }
        else{
            const ciziten = await Citizen.findOne({ CPF: cpf });
            if (!ciziten) return res.status(404).json({ message: "Citizen not found" });
            res.status(200).json(ciziten);
        }
    }
    catch(error){
        res.status(500).json({ message: "Server error" });
    }
}

export const createCitizen = async(req: Request, res: Response) => {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

    const { CPF, name, birthday, motherName, benefitNumber, phone } = req.body;
    try{
        let citizen = await Citizen.findOne({ CPF: CPF });
        if(citizen){
            return res.status(404).json({ message: "Citizen already exists."});
        }
        citizen = new Citizen({
            CPF, name, birthday, motherName, benefitNumber, phone
        });
        await citizen.save();

        const token = jwt.sign({ cpf: citizen.CPF }, process.env.JWT_SECRET as string, {
            expiresIn: "1d"
        })

        res.status(201).json({
            "citizen": citizen,
            "token": token
        })

    }
    catch(error){
        res.status(500).json({ message: "server error" });
    }
}

export const updateCitizen = async(req: Request, res: Response) => {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

    try{
        const cpf = req.params.CPF;
        const { name, birthday, motherName, benefitNumber, phone, status } = req.body;
        const citizen = await Citizen.findOne({ CPF: cpf });

        if(!citizen) return res.status(404).json({ message: "Citizen not found"});

        citizen.name = name || citizen.name;
        citizen.birthday = birthday || citizen.birthday;
        citizen.motherName = motherName || citizen.motherName;
        citizen.benefitNumber = benefitNumber || citizen.benefitNumber;
        citizen.phone = phone || citizen.phone;
        citizen.status = status || citizen.status;

        citizen.save();
        res.status(200).json({ message: "Updated successfully" });
    }
    catch(error){
        res.status(500).json({ error: "Failed to fetch citizen" });
    }
}

export const updatePhone = async(req: Request, res: Response) => {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

    try{
        const cpf = req.params.CPF;
        const citizen = await Citizen.findOne({ CPF: cpf });

        if(!citizen) return res.status(404).json({ message: "Citizen not found"});

        citizen.phone = req.body.phone;
        citizen.save();

        res.status(200).json({ message: "Updated successfully" });
    }
    catch(error){
        res.status(500).json({ error: "Failed to fetch citizen" });
    }
}

export const updateStatus = async(req: Request, res: Response) => {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

    try{
        const cpf = req.params.CPF;
        const citizen = await Citizen.findOne({ CPF: cpf });

        if(!citizen) return res.status(404).json({ message: "Citizen not found"});

        citizen.status = req.body.status;
        citizen.save();

        res.status(200).json({ message: "Updated successfully" });
    }
    catch(error){
        res.status(500).json({ error: "Failed to fetch citizen" });
    }
}

export const deleteCitizen = async(req: Request, res: Response) => {
    try {
        const cpf = req.params.CPF

        const citizen = await Citizen.findOne({ CPF: cpf});
        if (!citizen) return res.status(404).json({ message: "Citizen not found" });

        await citizen.deleteOne();
        res.status(200).json({ message: "Citizen deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

