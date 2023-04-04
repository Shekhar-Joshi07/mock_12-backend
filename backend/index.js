const express = require("express")
const {connection} = require("./db")
const{userRouter} = require("./routes/User.routes")
const cors = require("cors")
require("dotenv").config();
const app = express();

app.use(express.json())


app.use(cors())

app.get("/",(req,res)=>{
    res.send("Welcome TO MY Home Page")
})

app.use("/users",userRouter)

app.listen(8080,async()=>{
    try {
        await connection
        console.log("connected to db")
    } catch (error) {
        console.log(error.message)
       

        
    }
    console.log(`server is running at port ${process.env.PORT}`);
})