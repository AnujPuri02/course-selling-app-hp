const Router = require("express");
const { userModel, courseModel } = require("../db");
const courseRouter = Router();

courseRouter.post("/purchase",(req,res)=>{

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