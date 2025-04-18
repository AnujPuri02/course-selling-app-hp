const Router = require("express");
const { userModel, courseModel,purchaseModel } = require("../db");
const courseRouter = Router();

courseRouter.post("/purchase",userMiddleware,async(req,res)=>{
    const userId = req.userId;
    const courseId = req.body.courseId;
    try{
        await purchaseModel.create({
            userId,
            courseId
        })
        res.send({
            msg:"user successfully purchased the course !!"
        })
    }
    catch(err){
        res.send({
            msg:"error while purchasing the course !!"
        })
    }

});


courseRouter.get("/all-courses",async(req,res)=>{
    const allCourses = await courseModel.find({

    })
    if(allCourses.length==0)return res.send({
        msg:"there is not any course now !!"
    })
    else{
        return res.send({
            msg:"all the courses are :",
            allCourses
        })
    }

})

module.exports=courseRouter;