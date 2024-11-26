import mongoose from "mongoose";
require ('dotenv').config();

// Connect to MongoDB
const dbUrl: string = process.env.DB_URI || '';

const connectDB = async () => {
    try{
        await mongoose.connect(dbUrl).then((data:any) => {
            console.log(`Database connected successfully with ${data.connection.host}`);
        });
    }catch(e:any){
        console.log(e.message);
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;