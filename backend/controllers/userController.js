import ErrorHander from "../utils/errorhander.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import User from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avtar: {
      public_id: "this is a sample id",
      url: "profilepicUrl",
    },
  });
  sendToken(user, 201, res);
});

//login user
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHander("please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("invalid email or password ", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("invalid email or password ", 401));
  }
  // const token = await user.getJWTToken()
  // res.status(200).json({
  //     success: true,
  //     token
  // });
  sendToken(user, 200, res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged Out",
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHander("user not found ", 404));
  }
  //get reset passwowrd token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `your password reset token is :- \n \n ${resetPasswordUrl}
    \n if you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `ecommerce password recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHander(error.message, 500));
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander("reset password token is invalid or has been expire", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match"), 400);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

//get usser detail
export const getUserdetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

//update user password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHander("old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//update user profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.name,
  };
  //we will add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true });
});

//get all user --admin
export const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//get single user --admin
export const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.find({ _id: req.params.id });
  if (!user) {
    return next(
      new ErrorHander(`user does not exit with id: ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//update user role --admin
export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true });
});

//delete user --admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      new ErrorHander(`user does not exit with id: ${req.params.id}`)
    );
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message:"user deleted successfully"});
});
