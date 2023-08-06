import express from "express"
import { getAllProduct, createProduct, updateProduct, deleteProduct, getProductDetail, createProductReview, getProductReviews, deleteReview} from "../controllers/productController.js";
import { isAuthenticatedUser,authorizeRoles } from "../middleware/auth.js";

const router = express.Router()

router.get('/products',isAuthenticatedUser,authorizeRoles("admin"),getAllProduct)

router.post('/product/new',isAuthenticatedUser,authorizeRoles("admin"),createProduct)

router.put('/product/:id',isAuthenticatedUser,authorizeRoles("admin"),updateProduct)

router.delete('/product/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)

router.get('/product/:id',getProductDetail)
router.put('/review',isAuthenticatedUser,createProductReview)

router.get("/reviews",getProductReviews)
router.delete("/reviews",deleteReview)

export default router;
