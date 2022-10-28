//title, des, deadline, isFinish, author
const mongoose=require('mongoose')
const Schema=mongoose.Schema
const slug=require('mongoose-slug-generator')
mongoose.plugin(slug);
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
    gid:
    {
        type:String,
    },
    slug:{
        type:String,
        slug:"id",
    }
})
module.exports=mongoose.model('Tasks',Tasks)