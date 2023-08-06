import ErrorHander from "../utils/errorhander.js";

const errorHandler = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "internal server error"

    //wrong mongoDB id error
    if(err.name==="CastError"){
        const message = `resource not found invalid ${err.path}`;
        err = new ErrorHander(message,400);
    }

    //mongoose duplicate key error
    if(err.code===11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err=new ErrorHander(message,400)
    }

    //wrong JWT error
    if(err.name==="jsonWebTokenError"){
        const message = `json web token is invalid, try again`;
        err=new ErrorHander(message,400)
    }

    //jwt expire token
    if(err.name==="TokenExpiredError"){
        const message = `json web token is expired, Try again`;
        err=new ErrorHander(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
}

export default errorHandler