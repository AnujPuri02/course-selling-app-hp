
const Router = require("express");
const {userModel }= require("../db");
const zod = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../Middlewares/user");

const {JWT_USER_SECRET}=require("../config");

const userRouter = Router();

userRouter.post("/signup",async(req,res)=>{
    const {email,password,firstName,lastName}=req.body;
    const requiredBody = zod.object({
        email:zod.string().email(),
        password:zod.string().password(),
        firstName:zod.string(),
        lastName:zod.string()
    })

    const {success,error} = requiredBody.safeParse(req.body);
    if(error){
       return res.send({
            msg:"provide valid credentials..",
            error:error
       })
    }
    try{
        const hashedPass = bcrypt.hash(password,5);
        console.log(hashedPass);
        await userModel.create({
            email,
            password:hashedPass,
            firstName,
            lastName
        })
        return res.send({
            msg:"sign up suceessfully !!"
        })
    }
    catch(err){
        return res.send({
            msg:"user not found !!"
        })
    }

});


userRouter.post("/signin",async(req,res)=>{
    const {email,password}= req.body;
    const requiredBody = zod.object({
        email:zod.string().email(),
        password:zod.string().password()
    })
    const {sucess, error} = requiredBody.safeParse(req.body);
    if(error){
        return res.send({
            msg:"provide valid email and pass ..",
            err:error
        })
    }

    try{
        const user = await userModel.findOne({
            email
        })

        bcrypt.compare(password,user.password);
        if(user){
            const token = jwt.sign({
                userId :user._id
            },JWT_USER_SECRET);

            return res.send({
                msg:"signin successfully !!",
                token
            })
        }

    }
    catch(err){
        return res.send({
            msg:"user not found !!"
        })
    }
    

});





userRouter.get("/courses",userMiddleware, async(req,res)=>{
    const userId = req.userId;
    try{
       const myCourses= await userModel.find({
            _id:userId
        })
        if(myCourses.length==0){
            return res.send({
                msg:"you have not purchased any course !!"
            })
        }
        else{
            return res.send({
                msg:"your courses are : ",
                myCourses
            })
        }
    }
    catch(err){

    }

});


module.exports=userRouter;