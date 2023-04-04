
const jwt = require("jsonwebtoken")

const authenticate = (req,res,next)=>{
    const token = req.headers.token

    jwt.verify(token,"backend",(err,decoded)=>{
        if(decoded){
            req.body.user=decoded.userID
            next()
        }else{
            res.send({"mssg":"User already exist, please login"})
        }
    })
}

module.exports={
    authenticate
}