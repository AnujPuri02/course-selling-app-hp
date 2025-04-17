const jwt = require("jsonwebtoken")
const {JWT_USER_SECRET} = require("../config");


function userMiddleware(req,res,next){
    const token = req.headers.token;
    try{
        const decodedData = jwt.verify(token,JWT_USER_SECRET);
        if(decodedData.userId){
            req.userId = decodedData.userId;
            next();
        }
    }
    catch(err){
        return res.send({
            msg:"invalid token !!"
        })
    }

}

module.exports=userMiddleware;