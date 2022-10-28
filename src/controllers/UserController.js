const Users=require('../models/Users')
const userController={
    postLogIn:(req,res)=>{
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
    postEditUsers:(req,res)=>{},
    getEditUsers:(req,res)=>{
        if(!req.session.username)
        {
            console.log('no exists')
            return res.redirect('/users/login')
        }
        return res.render('details')
    },

    getDeleteUsers:(req,res)=>{
        const id=req.params.username
        Users.findOne({username:id}).then(user=>{
            if(!user)
            {
                return res.redirect('/users/login')
            }
            user.delete()
            return res.redirect('/users/login')
        })
    },
    
    getLogOut:(req,res)=>{},
}
module.exports=userController