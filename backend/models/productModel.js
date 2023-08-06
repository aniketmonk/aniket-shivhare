import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: { type: String, required: [true, "please enter product name"], trim:true },
    description: { type: String, required: [true, "please enter product description"] },
    price: { type: Number, required: [true, "please enter product price"], maxLength: [8, "price cannot exceed 8 character"] },
    ratings: { type: Number, default: 0 },
    images:[
        {            
                public_id: {
                    type: String,
                    required:true
                },
                url:{
                    type:String,
                    require:true
                }
        }
    ],
    category:{type:String, required:[true,"please enter product category"]},
    stock:{
        type:Number,
        required:[true,"please enter product stock"],
        maxLength:[4,"stock cannot exceed 4 characters"],
        default:1
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"user",
                required:true,
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

const productModel = mongoose.model("product",productSchema)

export default productModel;