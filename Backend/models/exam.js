import mongoose from "mongoose";
const examSchema=new mongoose.Schema({
    examName:{type:String,required:true},
    createdBy:{type:String,required:true},
    groups:{type:[String],required:true},
    time:{type:Date,default:Date.now}
})
const exam=mongoose.model("exam",examSchema);
export default exam;