import mongoose from 'mongoose';
const questionsSchema=new mongoose.Schema({
    examName:{type:String,required:true},
    questionNo:{type:Number,required:true},
    questionsType:{type:String,required:true},
    question:{type:String,required:true},
    additional:{type:[String],required:false,default:[]},
    createdAt:{type:Date,default:Date.now}
})
const question=mongoose.model("question",questionsSchema);
export default question;