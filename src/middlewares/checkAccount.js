const Tasks=require('../models/Tasks')
module.exports = checkAccounts = async (req, res, next) => {
    if(!req.session.username) {
        return res.redirect('/users/login');
    }
    else {
        let myPost=await Tasks.findOne({author: req.session.username});
        if(myPost.author==req.session.username)
        {
            next();
        }
        else {
            req.flash('error', "Bài task này không thuộc tài khoản của bạn");
            return res.redirect('/users/login');
        }
    }
    
}