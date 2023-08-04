import ErrorHander from "../utils/errorhander.js"
import catchAsyncError from '../middleware/catchAsyncErrors.js'
import User from '../models/userModel.js'
import sendToken from "../utils/jwtToken.js";

export const registerUser = catchAsyncError(
    async (req, res, next) => {
        const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            avtar: {
                public_id: "this is a sample id",
                url: "profilepicUrl"
            }
        })
        sendToken(user,201,res)
    }
)

//login user
export const loginUser = catchAsyncError(async (req,res,next)=>{
    const {email,password}=req.body;
    //checking if user has given password and email both
    if(!email || !password){
        return next(new ErrorHander("please enter email and password",400));
    }
    const user = await User.findOne({email}).select("+password");
    
    if(!user){
        return next(new ErrorHander("invalid email or password ",401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("invalid email or password ",401));
    }
    // const token = await user.getJWTToken()
    // res.status(200).json({
    //     success: true,
    //     token
    // });
    sendToken(user,200,res)
})

export const logout = catchAsyncError(
    async (req,res,next)=>{
        res.cookie("token",null,
        {
            expires:new Date(Date.now()),
            httpOnly:true,
        });
        res.status(200).json({
            success:true,
            message:"logged Out",
        });
    }
)