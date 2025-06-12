import mongoose from "mongoose";
const examSchema=new mongoose.Schema({
    examName:{type:String,required:true},
    createdBy:{type:String,required:true},
    groups:{type:[String],required:true},
    duration:{type:Number,required:true},
    createtime:{type:Date,default:Date.now},
    endTime:{type:Date,default:null},
    linearity:{type:Boolean,default:false,required:true},
    submitted:{type:Boolean,default:false}
})
const exam=mongoose.model("exam",examSchema);
export default exam;