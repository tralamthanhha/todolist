const express=require('express');
const routers=express.Router();
const TaskController=require('../controllers/TaskController')
const checkAuthor=require('../middlewares/checkAccount')

routers.get('/create',TaskController.getcreateTasks)
routers.post('/create',TaskController.postcreateTasks)

routers.get('/edit/:id',TaskController.getEditTasks)
routers.post('/edit',TaskController.postEditTasks)

routers.get('/delete/:id',TaskController.getDeleteTasks)

routers.get('/unknown/:id',TaskController.getDetails)
module.exports=routers