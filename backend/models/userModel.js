import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "please enter your name"],
            maxLength: [30, "name cannot excceed 30 character"],
            minLength: [4, "name should have more than 4 character"]
        },
        email: {
            type: String,
            required: [true, "please enter your email"],
            unique: true,
            validate: [validator.isEmail, "please enter a valid email"],

        },
        password: {
            type: String,
            required: [true, "please enter your password"],
            minLength: [8, "password should be greater than 8 character"],
            select: false,
        },
        avtar: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                require: true
            }
        },
        role:{
            type:String,
            default:"user",        
        },
        resetPasswordToken:String,
        resetPasswordExpire:Date,
    }
)

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password= await bcrypt.hash(this.password,10)
});

//jwt token
userSchema.methods.getJWTToken = function(){
    return Jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

//compare password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

const userModel = mongoose.model("user",userSchema)
export default userModel;