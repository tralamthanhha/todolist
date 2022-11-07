const express=require('express')
const multer=require('multer')
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'src/public/uploads')
    },
    filename:function(req,file,cb){
        let extname=file.originalname.substring(file.originalname.lastIndexOf('.'))
        cb(null,file.fieldname+'-'+Date.now() +extname)
    }
})
module.exports=upload=multer({storage:storage})
//lùi:ctrl+[