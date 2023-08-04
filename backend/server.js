import app from "./app.js"
import env from "dotenv"
import connectDatabase from "./config/database.js"

//handle uncaugth exception
process.on("uncaughtException",(err)=>{
    console.log(`error: ${err.message}`);
    console.log(`shutdown the server due touncaugth exception`)
    process.exit(1)
})

//config 
env.config({path:"backend/config/config.env"})
//connect database
connectDatabase()
const server=app.listen(process.env.PORT, ()=>{
    console.log(`server is workning http://localhost:${process.env.PORT}`)
})

//unhandled promise rejection 
process.on("unhandledRejection",err=>{
    console.log(`error ${err.message}`);
    console.log(`shut down server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit()
    })
})