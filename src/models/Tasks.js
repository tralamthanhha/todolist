//title, des, deadline, isFinish, author
const mongoose=require('mongoose')
const Schema=mongoose.Schema
const slug=require('mongoose-slug-generator')
mongoose.plugin(slug);
const Tasks=new Schema({
    id:{
        type:String,
        unique:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    deadline:{
        type:Date,
    },
    isFinished:{
        type:Boolean,
        default:false,
    },
    author:{
        type:String,
        require:true,
    },
    slug:
    {
        type:String,
        slug:'title'
    },
    gid:{
        type:String,
    },
    editors:{
        type:[String],
    }
})
module.exports=mongoose.model('Tasks',Tasks)