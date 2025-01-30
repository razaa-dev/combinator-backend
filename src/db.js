import mongoose from "mongoose";
import env from "dotenv"
env.config();

const connectDB = () => {
    const uri = process.env.MONGODB_CONNECTION_URI;
 
    mongoose.connect(uri,{
        autoCreate: true,
        autoIndex: true
    }).then((res)=>{
        console.log("DB Connected Successfully")
    }).catch((err)=>{
        console.log("DB Connection Error");
    })
}

export default connectDB;