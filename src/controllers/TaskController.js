const Tasks=require('../models/Tasks')
const Users = require('../models/Users')
const TaskController={
    getcreateTasks:(req,res)=>{
        if(req.session.username)
        {
            username=req.session.username
            return res.render('tasks/createTasks',{username})
        }
    },
    postcreateTasks:(req,res)=>{
        const {id,title,description,deadline,isFinished,author,gid}=req.body
        if(!req.session.username)
        {
            return res.redirect('/users/login')
        }
        Tasks.findOne({id:id}).then(task=>{
            if(task)
            {
                req.flash('error','task exists')
                return res.redirect('/tasks/createTasks')
            }
            var newTask={
                id:id,
                title:title,
                description:description,
                deadline:deadline,
                isFinished:isFinished,
                author:req.session.username,
            }
            new Products(newTask).save()
            req.flash('success','task create success')
            return res.redirect('/')
        })
    },
    postEditTasks:(req,res)=>{
        const{id,title,description,deadline,isFinished,author,gid}=req.body
        
    },
    getEditTasks:(req,res)=>{},
    getDeleteTasks:(req,res)=>{},
}
module.exports=TaskController