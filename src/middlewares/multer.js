const express=require('express')
const multer=require('multer')
const fs=require('fs')
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        let pid=req.body.Pid;
        let dir= `src/public/uploads/${Pid}`
        if(!fs.existsSync(dir))
        {
            fs.mkdirSync(dir,{recursive:true})
        }
        cb(null,dir)
    },
    filename:function(req,file,cb){
        let extname=file.originalname.substring(file.originalname.lastIndexOf('.'))
        cb(null,file.fieldname+'-'+Date.now() +extname)
    }
})
module.exports=upload=multer({storage:storage})
//lùi:ctrl+[