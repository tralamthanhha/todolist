const Tasks=require('../models/Tasks')
let alert = require('alert');
const { getOne } = require('../TasksAPI/TasksAPI');
const TaskAPI = require('../TasksAPI/TasksAPI');
const TaskController={
    getcreateTasks:(req,res)=>{
        let error=req.flash('error')||''
        let success=req.flash('success')||''
        if(req.session.username)
        {
            username=req.session.username
            return res.render('tasks/createTasks',{username,error:error,success:success})
        }
        return res.redirect('/users/login')
    },
    postcreateTasks:(req,res)=>{
        const {title,description,deadline,isFinished,gid}=req.body
        a=title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D').split(' ').join('-').replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g,"")
        +"<"+req.session.username+">"
        if(!req.session.username)
        {
            req.flash('error','Please log in to create task')
            return res.redirect('/users/login')
        }
        Tasks.findOne({id:a}).then(task=>{
            if(task)
            {
                req.flash('error','task exists')
                return res.redirect('/tasks/create')
            }
            var newTask={
                id:a,
                title:title,
                description:description,
                deadline:deadline,
                isFinished:isFinished=="false"?false:true,
                gid:gid,
                author:req.session.username,
            }
            new Tasks(newTask).save()
            req.flash('success','task create success')
            return res.redirect('/')
        })
    },
    postEditTasks:(req,res)=>{
        const{_id,title,description,deadline,isFinished,gid}=req.body
        a=title.toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D').split(' ').join('-')
        .replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g,"")
        Tasks.findOne({_id:_id}).then(task=>{
            if(!task)
            {
                req.flash('error','Task not exist')
                return res.redirect(`/tasks/edit/${task.id}`)
            }
            if(!req.session.username)
            {
                req.flash('error','Please log in to edit')
                return res.redirect(`/tasks/unknown/${task.id}`)
            }
            var editor=''
            const checkNull={
                deadline:deadline==''?task.deadline:deadline,
                title:title==''?task.title:title,
                description:description==''?task.description:description,
                gid:gid==''?task.gid:gid,
            }
            if(task.author!=req.session.username)
            {
                editor=req.session.username
            }
            task.id=a+"<"+task.author+">"
            task.title=title
            task.description=description
            task.isFinished=isFinished
            task.gid=gid
            task.editors.push(editor)
            task.deadline=checkNull.deadline
            task.save()
            return res.redirect('/')
        })
    },
    getEditTasks:(req,res)=>{
        const success = req.flash('success') || '';
        const error = req.flash('error') || '';
        const id=req.params.id
        Tasks.findOne({id:id}).then(task=>{
            if(!task){
                alert('Task not exist')
                return res.redirect('/tasks/create')
                //return res.json({success:false,msg:'Task not exist'})
            }
            if(!req.session.username)
            {
                alert('Please log in to edit task')
                return res.redirect(`/tasks/unknown/${task.id}`)
            }
            const data={
                _id:task._id,
                id:task.id,
                title:task.title,
                description:task.description,
                isFinished:task.isFinished,
                gid:task.gid,
                deadline:task.deadline,
                editors:task.editors,
                author:task.author,
            }
            return res.render('tasks/details', {
                data: data,
                success, error
            })
        })
        
    },
    getDeleteTasks:(req,res)=>{
        const id=req.params.id
        Tasks.findOne({id:id}).then(task=>{
            if(!task)
            {
                return res.redirect('/tasks/create')
            }
            task.delete()
            return res.redirect('/tasks/create')
        })
    },
    getDetails:(req,res)=>{
        const id=req.params.id
        Tasks.findOne({id:id}).lean()
        .then(task => {
            var data={
                id:task.id,
                author:task.author,
                title:task.title,
                description:task.description,
                deadline:task.deadline,
                gid:task.gid,
                editors:task.editors,
            }
            return res.render('tasks/detailsForUnknown',{data:data})
        });
    }
}
module.exports=TaskController