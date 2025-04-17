const mongoose = require("mongoose");
const Schema = mongoose.Schema;

console.log("mongoose connected ..")

const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName :String
})


const adminSchema = new Schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName :String
})


const courseSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:ObjectId
})

const purchaseSchema = new Schema({
    courseId:ObjectId,
    userId:ObjectId
})


const userModel = mongoose.model("users",userSchema);
const courseModel = mongoose.model("courses",courseSchema);
const adminModel = mongoose.model("admin",adminSchema);
const purchaseModel = mongoose.model("purchases",purchaseSchema);

module.exports={
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}