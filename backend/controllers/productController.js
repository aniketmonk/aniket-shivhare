import ErrorHander from "../utils/errorhander.js"
import Product from "../models/productModel.js"
import catchAsyncError from '../middleware/catchAsyncErrors.js'
import ApiFeatures from "../utils/apifeatures.js";
//create product-- admin
export const createProduct = catchAsyncError(
    async (req,res, next) => {
        req.body.user = req.user.id
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    }
);

//get all products
export const getAllProduct = catchAsyncError( async (req, res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature= new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({ success: true, products,productCount })
})

//get product deatil
export const getProductDetail = catchAsyncError( async (req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("product not found",404))
    }
    res.status(200).json({ success: true, product })
})

//update product-- admin
export const updateProduct = catchAsyncError( async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("product not found",404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    return res.status(200).json({ success: true, product })
})

//delete product --admin
export const deleteProduct = catchAsyncError( async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("product not found",404))
    }
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message:"delete successfully"})
})


