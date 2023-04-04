
const express = require("express")
const {UserModel} = require("../models/User.model")
const {authenticate} = require("../middlewares/authorization.middleware")
const jwt = require("jsonwebtoken")
const userRouter = express.Router()

const bcrypt = require("bcrypt");

// register route
userRouter.post("/register",async(req,res)=>{
    const {name,email,password} = (req.body)
    try {
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err) res.send({"msg":"Something went wrong","error":err.message})
            else{
                const user = new UserModel({name,email,password:hash})
                await user.save()
                res.send({"mssg":"New user has been registered successfully"})
            }
        })
    } catch (error) {
        res.send({"msg":"Something went wrong","error":err.message})
    }
})

//login route

   userRouter.post("/login",async(req,res)=>{
    const {email,password} = (req.body)
    try {
        const user = await UserModel.find({email})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                    let token = jwt.sign({userID:user[0]._id},"backend")
                    res.send({"mssg":"Logged in successful","token":token})
                }else{
                    res.send({"mssg":"Invalid Credentials","err":err.message})
                }
            })
        }else{
            res.send({"mssg":"Invalid Credentials"})
        }
    } catch (error) {
        res.send({"mssg":"Something went wrong here", "error":err.message})
    }
   })


// getprofile route

  userRouter.get("/getProfile",authenticate,async(req,res)=>{

    try {
        const user = await UserModel.findOne({_id:req.body.user});
        if(user){
            res.send({user})
        }else{
            res.send({"msg":"Invalid user"})
        }
    } catch (error) {
        res.send({"msg":"Something went wrong"})
    }
  })

  userRouter.post("/calculate",authenticate,async(req,res)=>{
    const {amount,rate, years}= req.body;
    const i =rate/100;
    const n = years;
    const p = amount;

    const F= p*((Math.pow(1+i,n)-1)/i)
    const totalInvestment = p*n;
    const totalInterest = F-totalInvestment;

    try {
        res.send({
            totalInvestment:totalInvestment.toFixed(0),
            totalInterest:totalInterest.toFixed(0),
            maturityValue:F.toFixed(0),
        })
        
    } catch (error) {
        res.send({"msg":error.message})
        
    }
  });


   module.exports={userRouter}