const Router = require("express");
const { adminModel, courseModel } = require("../db");
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
                msg:"admin already exists  !!"
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

        const passwordMatch = bcrypt.compare(password,admin.password);
        if(passwordMatch){
            const token = jwt.sign({
                adminId :admin._id
            },JWT_ADMIN_SECRET);

            return res.send({
                msg:"signin successfully !!",
                token
            })
        }
        return res.send({
            msg:"admin not found !!"
        })

    }
    catch(err){
        return res.send({
            msg:"admin not found !!"
        })
    }
    
})

// admin can create a  course 
adminRouter.post("/course",adminMiddleware,async(req,res)=>{
    const adminId = req.adminId;
    const {title,description,price,imageUrl}=req.body;
    const requiredBody = zod.object({
        title:zod.string(),
        descrption:zod.string(),
        price:zod.number(),
        imageUrl:zod.string(),
    })
    const {success,error}= requiredBody.safeParse(req.body);
    if(error){
        return res.send({
            msg:"provide valid course credentials !!",
            err:error
        })
    }
    try{
        await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            creatorId:adminId
        })
        res.send({
            msg:"course created successfully !!"
        })
    }
    catch(err){
        res.send({
            msg:"error while creating a course !!"
        })
    }
    
})


// admin can see all their courses
adminRouter.get("/preview",adminMiddleware,async(req,res)=>{
    const adminId = req.adminId;
    try{
        const adminCourses = await courseModel.find({
            creatorId:adminId
        })
        if(adminCourses.length==0)return res.send({
            msg:"admin do not have any course !!"
        })
        res.send({
            msg:"all courses are ",
            adminCourses
        })
    }
    catch(err){
        res.send({
            msg:"error while finding a course in courseModel !!"
        })
    }
})


adminRouter.put("/course",adminMiddleware,async(req,res)=>{
    const adminId = req.adminId;
    const {title,description,price,imageUrl,courseId}=req.body;
    const requiredBody = zod.object({
        title:zod.string(),
        descrption:zod.string(),
        price:zod.number(),
        imageUrl:zod.string(),
        courseId:zod.string()
    })
    const {success,error}= requiredBody.safeParse(req.body);
    if(error){
        return res.send({
            msg:"provide valid course credentials !!",
            err:error
        })
    }

    try{
        await courseModel.updateOne({
            _id:courseId,
            creatorId:adminId
        },
        {
            $set:{
                title:title,
                description:description,
                price:price,
                imageUrl:imageUrl
            }
        }
        )
        res.send({
            msg:"course is updated successfully !!"
        })
    }
    catch(err){
        res.send({
            msg:"you dont have any course for this courseId !!"
        })
    }
   
   
    
});


module.exports=adminRouter;