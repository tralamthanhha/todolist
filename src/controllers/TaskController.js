const Tasks=require('../models/Tasks')
const TaskController={
    getcreateTasks:(req,res)=>{
        if(req.session.username)
        {
            username=req.session.username
            return res.render('tasks/createTasks',{username})
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
        a=title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D').split(' ').join('-')
        .replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g,"")
        if(!req.session.username)
        {
            return res.redirect('/users/login')
        }
        Tasks.findOne({_id:_id}).then(task=>{
            if(!task)
            {
                console.log("k tồn tại tasks")
                return res.redirect(`/tasks/edit/${task.id}`)
            }
            let editorList=[]
            if(task.author!=req.session.username)
            {
                editorList.push(req.session.username)
            }
            task.id=a+"<"+task.author+">"
            task.title=title
            task.description=description
            task.deadline=deadline
            task.isFinished=isFinished
            task.gid=gid
            task.editors=editorList
            task.save()
            console.log("tasks saved to db")
            return res.redirect('/')
        })
    },
    getEditTasks:(req,res)=>{
        const success = req.flash('success') || '';
        const error = req.flash('error') || '';
        const id=req.params.id
        if(!req.session.username)
        {
            return res.redirect('/users/login')
        }
        Tasks.findOne({id:id}).then(task=>{
            if(!task){
                return res.json({success:false,msg:'Bài viết không tồn tại'})
            }
            const data={
                _id:task._id,
                id:task.id,
                title:task.title,
                description:task.description,
                isFinished:task.isFinished,
                gid:task.gid,
                deadline:task.deadline,
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
}
module.exports=TaskController