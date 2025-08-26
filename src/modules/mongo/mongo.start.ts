import dotenv from 'dotenv';
import mongoose from "mongoose"
import Admin from '@models/Admin';
import BankName from '@models/BankName';

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

// Load environment variables from .env file
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
});

const { MONGO_URI, SEED_PATH } = process.env;

/**
 * Initialize the Mongo Database
 */
const startMongoDB = async () => {
  try {
  
    console.log(MONGO_URI);
    console.log('Connecting...');
    await mongoose.connect(`${MONGO_URI}`);

    console.log('✔︎ Successfully connected to MongoDB.');

    // seed process
    await seedAdminUser();
  } catch (err) {
    console.error(`MongoDB Connection failed. Error: ${err}`);
    process.exit(1);
  }
};

/**
 * Seed the Admin User
 */
const seedAdminUser = async () => {
  const dataPath = path.resolve(__dirname, `${SEED_PATH}/seed-admin.json`);
  try {
    const data = JSON.parse( fs.readFileSync(dataPath, 'utf8') );
    const adminData = data?.admin;
    const bankData = data?.bank;

    if(adminData){

      const existingAdmin = await Admin.findOne({ email: adminData.email });
      if (existingAdmin) {
        return;
      }

      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      const adminUser = new Admin({
        ...adminData,
        password: hashedPassword,
      });

      await adminUser.save();
      console.log('Admin user created successfully.');
    }
    //add bank name to database
    if(bankData){
      const bankCount = await BankName.countDocuments();
      if( bankCount === 0 ){
        const banksToInsert = bankData.map((name: String, index: number) => ({
            bank_id: (index + 1).toString(), // Assigns 1, 2, 3...
            bankName: name
        }));

        await BankName.insertMany(banksToInsert);
        console.log("Bank names seeded successfully!");
      }
    }
    
  } catch (err) {
    console.error('Error seeding admin user:', err);
  }
};

export { startMongoDB };
