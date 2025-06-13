import mongoose from "mongoose";
const analyticsSchema=new mongoose.Schema({
    examId:{type:String,required:true},
    examWho:{type:String,required:true},
    totalQ:{type:Number,required:true},
    correctQ:{type:Number,required:true},
    duration:{type:Number,required:true},
    unattempted:{type:Number,required:true}
})
const analytic=mongoose.model('analytic',analyticsSchema);
export default analytic;