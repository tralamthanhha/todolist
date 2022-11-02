//redirect giúp đổi đường dẫn
const express=require('express')
const app=express()

const handlebars=require('express-handlebars')
const bodyParser=require('body-parser')

const Users=require('./models/Users')//tạo,gọi db,obj
const database=require('./config/db')

const upload=require('./middlewares/multer')
const session=require('express-session')
const cookieParser=require('cookie-parser')
//Flash: luu ham post goi ham get
const flash=require('express-flash')
//handlebar
app.set('view engine','hbs')
app.engine('hbs',handlebars.engine({
    extname:'hbs'
}))
//gọi router 
const userRouter=require('./routers/UserRouter')
const TaskRouter=require('./routers/TaskRouter')
const path=require('path')
const { find, findOne } = require('./models/Users')
const { executionAsyncResource } = require('async_hooks')
app.use(express.static(path.join(__dirname,'public')))//đường dẫn ngắn
app.set('views',path.join(__dirname,'views'))

database.connect();//gọi db


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
})) //backend nhận data từ form bên client

app.use(flash())
app.use(cookieParser('ahihi'))
app.use(session({cookie:{maxAge:30000000}}))

app.use('/users',userRouter)
app.use('/tasks',TaskRouter)
//home page source home nằm dưới cùng
app.get('/',async(req,res)=>{
    let error=req.flash('error')||''
    let tmp={
        name:req.session.username,
        password:req.session.password,
    }
    if(error){
        return res.render('home',{data:tmp})
    }
})
const port=3000
app.listen(port,()=>{
    console.log('success')
})
