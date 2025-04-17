const jwt = require("jsonwebtoken")
const {JWT_ADMIN_SECRET} = require("../config");


function adminMiddleware(req,res,next){
    const token = req.headers.token;
    try{
        const decodedData = jwt.verify(token,JWT_ADMIN_SECRET);
        if(decodedData.adminId){
            req.adminId = decodedData.adminId;
            next();
        }
    }
    catch(err){
        return res.send({
            msg:"invalid token !!"
        })
    }

}

module.exports=adminMiddleware;