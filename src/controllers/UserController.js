const Users=require('../models/Users')
const Tasks=require('../models/Tasks')
const TaskAPI = require('../TasksAPI/TasksAPI')
//const e = require('express')
let alert = require('alert');
const userController={
    postLogIn:(req,res,next)=>{
        const {username,password}=req.body
        Users.findOne({username:username}).then((user)=>
        {
            if(!user){
                req.flash('error','Account not exist')
                return res.redirect('/users/login')
            }
            else{
                if(user.password==password)
                {
                    req.session.username=user.username
                    req.session.password=user.password
                    req.session.avatar=user.avatar
                    req.flash('success','log in success')
                    return res.redirect('/')
                }
                else{
                    req.flash('error','Incorrect password!')
                    return res.redirect('/users/login')
                }
            }
        })
        .catch(next)
    },
    getLogIn:(req,res)=>{
        let error=req.flash('error')||''
        let success=req.flash('success')||''
        if(error){
            return res.render('users/login',{error:error,success:success})
        }
    },
    postSignUp:(req,res)=>{
        const {username,password}=req.body
        const file=req.file
        let avatarPath='/uploads/'+file.filename
        Users.findOne({username:username}).then(users=>{
            if(users)
            {
                req.flash('error','account exists')
                return res.redirect('/signUp')
            }
            var newUser={
                username:username,
                password:password,
                avatar:avatarPath,
            }
            new Users(newUser).save()
            req.flash('success','account create success')
            return res.redirect('/users/login')
        })
    },
    getSignUp:(req,res)=>{
        let error=req.flash('error')||''
        let success=req.flash('success')||''
        if(error){
            res.render('users/signup',{error:error,success:success})
        }
    },
    postEditUsers:(req,res)=>{
        const {username,password}=req.body
        if(!req.session.username)
        {
            req.flash('error','Please log in before edit')
            return res.redirect('/users/login')
        }
        Users.findOne({username:req.session.username})
        .then(user=>{
            if(!user){
                req.flash('error','cannot find users')
                return res.redirect('/')
            }
            TaskAPI.editAuthor(user.username,username)
            user.username=username
            user.password=password
            user.save();
            req.flash('success','edit account success')
            return res.redirect('/')
        })
        
    },
    getEditUsers:(req,res)=>{
        let error=req.flash('error')||''
        let success=req.flash('success')||''
        if(!req.session.username)
        {
            //res.send(req.flash('error'))
            alert('Please log in to edit account')
            return res.redirect('/users/login')
        }
        let tmp={
            name:req.session.username,
            password:req.session.password,
        }
        return res.render('users/details',{data:tmp})
    },

    getDeleteUsers:(req,res)=>{
        const id=req.params.id
        Users.findOne({username:id}).then(user=>{
            if(!user)
            {
                console.log("cannot find user")
                return res.redirect('/users/login')
            }
            user.delete()
            return res.redirect('/users/login',)
        })
    },
    
    getLogOut:(req,res)=>{
        req.session.destroy()
        return res.redirect('/')
    },
    getHistory:(req,res)=>{
        Tasks.find({author:req.session.username}).then(tasks=>{
            let condition1=""
            let data=tasks.map(task=>{
                const today=new Date()
                if((today>task.deadline||today===task.deadline)
                &&task.isFinished===false)
                {
                    //console.log("Missing"+" "+task.isFinished)
                    condition1="Missing";
                }
                else if((today<task.deadline)&&task.isFinished===false)
                {
                   // console.log("Do"+" "+task.isFinished+" bad:"+task.deadline)
                    condition1="Do";
                }
                else if((today>task.deadline||today===task.deadline||
                    today<task.deadline)&&task.isFinished===true)
                {
                   // console.log("Done"+" " +task.isFinished+" bad:"+task.deadline1)
                    condition1="Done"
                }
                else if(task.deadline==''){
                   // console.log("a"+" "+task.isFinished+" bad:"+task.deadline)
                    condition1="No due date"
                }
                else{
                    condition1="strange situation"
                }
                return {
                    id:task.id,
                    title:task.title,
                    description:task.description,
                    deadline:task.deadline,
                    isFinished:task.isFinished,
                    author:task.author,
                    condition:condition1,
                    gid:task.gid,
                }
            })
            return res.render('users/history',{data:data,
                avatar:req.session.avatar})
        })
    }
}
module.exports=userController
/*
bổ sung tính năng:
    + disable không cho người khác chỉnh sửa
     khi chưa đăng nhập
    + thêm thông báo cho người khác biết 
    phải đăng nhập ms chỉnh sửa được
*/