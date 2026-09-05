import mongoose from "mongoose";
const enquirySchema=new mongoose.Schema({name:{type:String,required:true,trim:true,maxlength:80},email:{type:String,required:true,lowercase:true,trim:true},phone:{type:String,required:true,trim:true,maxlength:20},message:{type:String,trim:true,maxlength:1200},package:{type:String,trim:true},status:{type:String,enum:["new","contacted","qualified","closed"],default:"new"}},{timestamps:true});
export const Enquiry=mongoose.models.Enquiry||mongoose.model("Enquiry",enquirySchema);
