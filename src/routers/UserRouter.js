const express=require('express');
const route=express.Router();
const userController=require('../controllers/UserController')
route.get('/signup',userController.getSignUp)
route.post('/signup',upload.single('avatar'),userController.postSignUp)

route.get('/login',userController.getLogIn)
route.post('/login',userController.postLogIn)

route.get('/edit',userController.getEditUsers)
route.post('/edit',userController.postEditUsers)

route.get('/logout',userController.getLogOut)

route.get('/delete/:id',userController.getDeleteUsers)

route.get('/history',userController.getHistory)
module.exports=route