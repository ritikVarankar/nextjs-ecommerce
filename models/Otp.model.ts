import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true,
        default:()=>new Date(Date.now() + 10 * 60 * 100) // i want 10 minutes to add with miliseconds
    },
    
}, { timestamps:true })

otpSchema.index({ expiresAt:1 } , { expireAfterSeconds:0 });


const OTPModel = mongoose.models.OTP || mongoose.model('OTP',otpSchema,'otps');

export default OTPModel;