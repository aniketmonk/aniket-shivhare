import ErrorHander from "../utils/errorhander.js";
import Product from "../models/productModel.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ApiFeatures from "../utils/apifeatures.js";
//create product-- admin
export const createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

//get all products
export const getAllProduct = catchAsyncError(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeature.query;
  res.status(200).json({ success: true, products, productCount });
});

//get product deatil
export const getProductDetail = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("product not found", 404));
  }
  res.status(200).json({ success: true, product });
});

//update product-- admin
export const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  return res.status(200).json({ success: true, product });
});

//delete product --admin
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.id);
  return res
    .status(200)
    .json({ success: true, message: "delete successfully" });
});

//create new review or update the review
export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews=product.reviews.length
  }
  let avg=0;
  product.review.forEach(rev=>{
    avg+=+rev.rating
  });
  product.ratings=avg/product.reviews.length;

  await product.save({validateBeforeSave:false})
  res.status(200).json({
    success:true,
  })
});

//get all reviews of a product
export const getProductReviews = catchAsyncError(
  async (req,res,next)=>{
    const product = await Product.findById(req.query.id)
    if(!product){
      return next(new ErrorHander("product not found",404));
    }

    res.status(200).json({
      success:true,
      reviews:product.reviews
    })
  }
)

//delete review
export const deleteReview = catchAsyncError(
  async (req,res,next)=>{
    const product = await Product.findById(req.query.productId)
    if(!product){
      return next(new ErrorHander("product not found",404));
    }

    const reviews = product.reviews.filter(rev=>rev._id.toString() !== req.query.id.toString)

    let avg=0;
    reviews.forEach(rev=>{
      avg+=+rev.rating
    });
    const ratings=avg/reviews.length;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new:true,
        runValidators:true,
        useFindAndModify:false,
      }
    )
    res.status(200).json({
      success:true
    })
  }
)