import mongoose from "mongoose";
const messageSchema=new mongoose.Schema({
    sender:{type:String,required:true},
    message:{type:String,required:true},
    roomId:{type:String,required:true},
    time:{type:Date,default:Date.now}
});
const msgs=mongoose.model("msgs",messageSchema);
export default msgs;