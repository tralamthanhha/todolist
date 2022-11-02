const Users=require('../models/Users')
const Tasks=require('../models/Tasks')
const userController={
    postLogIn:(req,res,next)=>{
        const {username,password}=req.body
        Users.findOne({username:username}).then((user)=>
        {
            if(!user){
                req.flash('error','Tài khoản không tồn tại')
                return res.redirect('/users/login')
            }
            else{
                if(user.password==password)
                {
                    req.session.username=user.username
                    req.session.password=user.password
                    req.session.avatar=user.avatar
                    return res.redirect('/')
                }
                else{
                    req.flash('error','Mật khẩu không đúng!')
                    return res.redirect('/users/login')
                }
            }
        })
        .catch(next)
    },
    getLogIn:(req,res)=>{
        let error=req.flash('error')||''
        if(error){
            return res.render('users/login',{error:error})
        }
        //return res.render('users/login')
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
        if(error){
            res.render('users/signup',{error:error})
        }
    },
    postEditUsers:(req,res)=>{
        const {username,password}=req.body
        Users.findOne({username:req.session.username})
        .then(user=>{
            if(!user){
                console.log("cannot find users")
                return res.redirect('/')
            }
            user.username=username
            user.password=password
            user.save();
            return res.redirect('/')
        })
        
    },
    getEditUsers:(req,res)=>{
        if(!req.session.username)
        {
            console.log('no exists')
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
            return res.redirect('/users/login')
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
                else{
                   // console.log("a"+" "+task.isFinished+" bad:"+task.deadline)
                    condition1="No due date"
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
    + cập nhật tên author bài viết khi chỉnh sửa tên người dùng
*/