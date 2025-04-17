const express = require("express");
const userRouter = require("./user");
const courseRouter = require("./course");
const adminRouter = require("./admin");

const app = express();

app.use(express.json());

app.use("/user",userRouter);
app.use("/course",courseRouter);
app.use("/admin",adminRouter);



app.listen(3000,()=>{
    console.log("listening on port 3000");
})
