import mongoose from "mongoose"
import { unique } from "next/dist/build/utils"
import { required, trim } from "zod/v4-mini"
import bcrypt from "bcryptjs"

export interface UserType extends Document {
    role:string;
    name: string;
    email: string;
    password: string;
    avatar:{
        url:string;
        public_id:string;
    }
    phone: string;  
    address: string;
    isEmailVerified: boolean;
    deletedAt: Date | null;
}


const userSchema = new mongoose.Schema<UserType>({
    role:{
        type:String,
        required:true,
        enum:["user",'admin'],
        default:'user'
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        select:false
    },
    avatar:{
        url:{
            type:String,
            trim:true
        },
        public_id:{
            type:String,
            trim:true
        }
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    phone:{
        type:String,
        trim:true
    },
    address:{
        type:String,
        trim:true
    },
    deletedAt:{
        type:Date,
        default:null,
        index:true
    }
}, { timestamps:true })


userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods = {
    comparePassword:async function(password: string) {
        return await bcrypt.compare(password,this.password);
    }
}

const UserModel = mongoose.models.User || mongoose.model('User',userSchema,'users');

export default UserModel;