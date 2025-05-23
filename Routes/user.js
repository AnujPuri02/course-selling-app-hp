
const Router = require("express");
const {userModel, purchaseModel, courseModel }= require("../db");
const zod = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../Middlewares/user");
require("dotenv").config();

const {JWT_USER_SECRET}=require("../config");

const userRouter = Router();

userRouter.post("/signup",async(req,res)=>{
    const {email,password,firstName,lastName}=req.body;
    const requiredBody = zod.object({
        email:zod.string().email(),
        password:zod.string(),
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
        const hashedPass = await bcrypt.hash(password,5);
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
            msg:"user already exists !!"
        })
    }

});


userRouter.post("/signin",async(req,res)=>{
    const {email,password}= req.body;
    const requiredBody = zod.object({
        email:zod.string().email(),
        password:zod.string()
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

        const passwordMatch = await bcrypt.compare(password,user.password);
        if(passwordMatch){
            const token = jwt.sign({
                userId :user._id
            },JWT_USER_SECRET);

            return res.send({
                msg:"signin successfully !!",
                token
            })
        }
        return res.send({
            msg:"user not found !!"
        })

    }
    catch(err){
        return res.send({
            msg:"user not exists !!"
        })
    }
    

});




// user can see their all purchased courses 

userRouter.get("/courses",userMiddleware, async(req,res)=>{
    const userId = req.userId;
    try{
       const myCourses= await purchaseModel.find({
            userId
        })
        const courseDetails = await courseModel.find({
            _id: {$in :myCourses.map(x=>x.courseId)}
        })
        if(myCourses.length==0){
            return res.send({
                msg:"you have not purchased any course !!"
            })
        }
        else{
            return res.send({
                msg:"your courses are : ",
                myCourses,
                courseDetails
            })
        }
    }
    catch(err){
        return res.send({
            msg:"error while finding the courses from purchaseModel !!"
        })
    }

});


module.exports=userRouter;