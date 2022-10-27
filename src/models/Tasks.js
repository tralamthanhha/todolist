//title, des, deadline, isFinish, author
const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Tasks=new Schema({
    id:{
        type:String,
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
        required:true,
    },
    isFinished:{
        type:Boolean,
    },
    author:{
        type:String,
        require:true,
    },
    file:
    {
        type:String,
    },
    gid:
    {
        type:String,
        require:true,
    },
    slug:{
        
    }
})
module.exports=mongoose.model('Tasks',Tasks)