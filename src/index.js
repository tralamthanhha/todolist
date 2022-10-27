const express=require('express')
const app=express()

const handlebars=require('express-handlebars')
const bodyParser=require('body-parser')

const flash=require('express-flash')
const session=require('express-session')
const cookieParser=require('cookie-parser')

const database=require('./config/db/index')
app.set('view engine','hbs')
app.engine('hbs',handlebars.engine({
    extname:'hbs'
}))

const path=require('path')

app.use(express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'views'))

// app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

const port=8000
app.listen(port,()=>{
    console.log("success")
})
database.connect()

app.get('/',(req,res)=>{
    return res.render('home')
})