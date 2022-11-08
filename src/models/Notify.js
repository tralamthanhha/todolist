const mongoose=require('mongoose')
const Schema=mongoose.Schema
const slug=require('mongoose-slug-generator')
mongoose.plugin(slug);
const Notify=new Schema({
    notifyID:
    {
        type:String,
        unique:true,
    },
    author:{type:String},
    editor:{type:String},
    Notify:{type:String},
    date:{
        type:Date,
        default:new Date(),
    },
    taskid:{type:String}
})
module.exports=mongoose.model('Notify',Notify)