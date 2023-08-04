import ErrorHander from "../utils/errorhander.js";

const errorHandler = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "internal server error"

    //wrong mongoDB id error
    if(err.name==="CastError"){
        const message = `resource not found invalid ${err.path}`;
        err = new ErrorHander(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
}

export default errorHandler