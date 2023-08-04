import catchAsyncError from '../middleware/catchAsyncErrors.js'
import ErrorHander from '../utils/errorhander.js';
import Jwt from 'jsonwebtoken';
import User from '../models/userModel.js'
export const isAuthenticatedUser = catchAsyncError(
    async (req, res, next) => {
        const { token } = req.cookies;
        if (!token) {
            return next(new ErrorHander("please login to access this resource", 401));
        }
        const decodeData = Jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodeData.id);
        next()
    }
)

export const authorizeRoles = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHander(
                `Role:${req.user.role} is not allowed to access this resouce `, 403
            ))
        }
        next();
    }
}