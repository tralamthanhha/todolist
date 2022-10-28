const mongoose=require('mongoose')
const Schema=mongoose.Schema
const slug=require('mongoose-slug-generator')
mongoose.plugin(slug);
const Groups=new Schema({
    gid:{
        type:String,
        unique:true,
    },
    name:{
        type:String,
    }
})
module.exports=mongoose.model('Groups',Groups)