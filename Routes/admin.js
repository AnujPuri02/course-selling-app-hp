const Router = require("express");
const { adminModel } = require("../db");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const bcrypt= require("bcryptjs");
const zod = require("zod");
const {JWT_ADMIN_SECRET}=require("../config");
const adminMiddleware = require("../Middlewares/admin");

adminRouter.post("/signup",async(req,res)=>{

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
            await adminModel.create({
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
                msg:"admin not found !!"
            })
        }

})



adminRouter.post("/signin",async(req,res)=>{
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
        const admin = await adminModel.findOne({
            email
        })

        bcrypt.compare(password,admin.password);
        if(admin){
            const token = jwt.sign({
                adminId :admin._id
            },JWT_ADMIN_SECRET);

            return res.send({
                msg:"signin successfully !!",
                token
            })
        }

    }
    catch(err){
        return res.send({
            msg:"admin not found !!"
        })
    }
    
})


adminRouter.post("/course",adminMiddleware,(req,res)=>{
    
})



adminRouter.get("/preview",adminMiddleware,(req,res)=>{
    
})


adminRouter.put("/course",adminMiddleware,(req,res)=>{
    
})


module.exports=adminRouter;