const express=require('express');
const routers=express.Router();
const TaskController=require('../controllers/TaskController')
routers.get('/createTasks',TaskController.getcreateTasks)
routers.post('/createTasks',TaskController.postcreateTasks)

routers.get('/editTasks',TaskController.getEditTasks)
routers.post('/editTasks',TaskController.postEditTasks)

routers.get('/delete/:id',TaskController.getDeleteTasks)
module.exports=routers