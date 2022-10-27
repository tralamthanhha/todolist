const mongoose=require('mongoose')
async function connect(){
    try{
        await mongoose.connect('mongodb://localhost:27017/ToDoList',
        {
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log("connect database oke")
    }
    catch(error)
    {
        console.log("connect database fail")
    }
}
module.exports={connect}