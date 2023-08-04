import express from "express"
import product from "./routes/productRoute.js"
import user from "./routes/userRoute.js"
import errorMiddleware from "./middleware/error.js"
import cookieParser from "cookie-parser"
const app = express()
app.use(express.json())
app.use(cookieParser())

//router imports
app.use("/api/v1",product)
app.use("/api/v1",user)
//middleWare for erros
app.use(errorMiddleware)

export default app
