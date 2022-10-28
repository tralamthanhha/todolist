const express=require('express');
const route=express.Router();
const userController=require('../controllers/UserController')
route.get('/signup',userController.getSignUp)
route.post('/signup',upload.single('avatar'),userController.postSignUp)

route.get('/login',userController.getLogIn)
route.post('/login',userController.postLogIn)


module.exports=route