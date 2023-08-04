const catchAsyncError = (theFanc) =>(req,res,next)=>{
    Promise.resolve(theFanc(req,res,next)).catch(next);
};

export default catchAsyncError;