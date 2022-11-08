const Tasks=require('../models/Tasks')
let alert = require('alert');
const TaskAPI = require('../API/TasksAPI');
const TaskController={
    getcreateTasks:async(req,res)=>{
        let error=req.flash('error')||''
        let success=req.flash('success')||''
        if(req.session.username)
        {
            let notify=await TaskAPI.getNotify(req.session.username)
            username=req.session.username
            return res.render('tasks/createTasks',{
                name:req.session.username,
                avatar:req.session.avatar,
                color:req.session.headerColor,
                username,error:error,success:success,
                notify:notify,
            })
        }
        return res.redirect('/users/login')
    },
    postcreateTasks:(req,res)=>{
        const {title,description,deadline,isFinished,gid}=req.body
        const a=title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
                console.log('a'+" "+task)
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
            var oldValue={
                id:task.id,
                title:task.title,
                description:task.description,
                isFinished:task.isFinished,
                gid:task.gid,
                deadline:task.deadline,
            }
            var newValue={
                id:a+"<"+task.author+">",
                title:title,
                description:description,
                isFinished:isFinished,
                deadline:checkNull.deadline,
                gid:gid,
            }
            console.log("Result:")
            TaskAPI.editVersion(task.id,editor,task.author,oldValue,newValue)
            task.id=a+"<"+task.author+">"
            task.title=title
            task.description=description
            task.isFinished=isFinished
            task.gid=gid
            task.editors.push(editor)
            var unique = task.editors.filter(function(elem, pos) {
                return task.editors.indexOf(elem) == pos;
            })
            task.editors=unique
            console.log('unique:')
            console.log(task.editors)
            console.log(typeof(task.editors[0]))
            task.deadline=checkNull.deadline
            task.save()
            return res.redirect('/')
        })
    },
    getEditTasks:async(req,res)=>{
        const success = req.flash('success') || '';
        const error = req.flash('error') || '';
        let notify= await TaskAPI.getNotify(req.session.username)
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
                success, error,
                name:req.session.username,
                avatar:req.session.avatar,
                color:req.session.headerColor,
                notify:notify,
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
    },
    getGroups:async(req,res)=>{
        const gid=req.params.gid
        const username=req.params.username
        const notify=await TaskAPI.getNotify(req.session.username)
        Tasks.find({gid:gid,author:username})
        .then(tasks=>{
            if(gid)
            {
                let data=tasks.map(task=>{
                const today=new Date()
                if((today>task.deadline||today===task.deadline)
                &&task.isFinished===false)
                {
                    condition1="Missing";
                }
                else if((today<task.deadline)&&task.isFinished===false)
                {
                    condition1="In Progress";
                }
                else if((today>task.deadline||today===task.deadline||
                    today<task.deadline)&&task.isFinished===true)
                {
                    condition1="Finish"
                }
                else if(task.deadline==''){
                    condition1="No due date"
                }
                else{
                    condition1="strange situation"
                }
                return {
                    id:task.id,
                    title:task.title,
                    description:task.description,
                    deadline:task.deadline.getDate()+"/"
                    +(task.deadline.getMonth()+1)+"/"
                    +task.deadline.getFullYear()+" "
                    +task.deadline.getHours()+":"
                    +task.deadline.getMinutes(),
                    isFinished:task.isFinished,
                    author:task.author,
                    condition:condition1,
                    gid:task.gid,
                }
            })
                return res.render('tasks/group',{data:data,
                    name:req.session.username,
                    avatar:req.session.avatar,
                    color:req.session.headerColor,
                    username:username,
                    notify:notify,
                })
            }
            else{
                return res.redirect('/tasks/create')
            }
        })
    },
    getDeleteGroups:(req,res)=>{
        const gid=req.params.gid
        
        Tasks.find({gid:gid,author:req.session.username})
        .then(tasks=>{
            if(gid)
            {
                tasks.forEach(deleteFunction)
                function deleteFunction(task)
                {
                    task.delete()
                }
                return res.redirect('/tasks/create')
            }
            else{
                return res.send('cannot find group')
            }
        })
    },
}
module.exports=TaskController