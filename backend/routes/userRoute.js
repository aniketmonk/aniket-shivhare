import express from "express"
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js"
import { deleteUser, forgotPassword, getAllUser, getSingleUser, getUserdetails,
     loginUser, logout,
     registerUser, resetPassword, 
     updatePassword, updateProfile, updateUserRole } from "../controllers/userController.js"
import { getAllProduct } from "../controllers/productController.js"

const router = express.Router()
router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/password/forgot',forgotPassword)
router.get('/logout',logout)
router.put('/password/reset/:token',resetPassword)
router.get('/me',isAuthenticatedUser,getUserdetails)
router.put('/password/update',isAuthenticatedUser,updatePassword)
router.put("/me/update",isAuthenticatedUser,updateProfile)
router.get("/admin/users",isAuthenticatedUser,authorizeRoles("admin"),getAllUser)
router.get("/admin/user/:id",isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)
router.put("/admin/user/:id",isAuthenticatedUser,authorizeRoles("admin"),updateUserRole)
router.delete("/admin/user/:id",isAuthenticatedUser,authorizeRoles("admin"),deleteUser)


export default router;