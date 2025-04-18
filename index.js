const express = require("express");
const userRouter = require("./Routes/user");
const courseRouter = require("./Routes/course");
const adminRouter = require("./Routes/admin");
const mongoose  = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/user",userRouter);
app.use("/course",courseRouter);
app.use("/admin",adminRouter);




async function connectMongo(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000,()=>{
        console.log("listening on port 3000");
    })
}

connectMongo();
