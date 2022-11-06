// username,password,avatar
const mongoose=require('mongoose')
const Schema=mongoose.Schema
const slug=require('mongoose-slug-generator')
mongoose.plugin(slug);
const Users=new Schema({
    username:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    },
    headerColor:{
        type:String,
    },
})
module.exports=mongoose.model('Users',Users)