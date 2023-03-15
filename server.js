require('dotenv').config()
require('./config/db')
const express = require('express')
const port = process.env.PORT || 3000
const app = express()

const cors=require('cors');
const options = {
  "Access-Control-Allow-Origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}

app.use(cors(options));
app.options('*',cors());

const bodyParser = require('body-parser')



app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json())

const UserRouter = require('./api/User')
const AdminRouter = require('./api/Admin')

app.use('/user',UserRouter)
app.use('/admin',AdminRouter)

app.listen(port, () => { 
  console.log(`app listening on port ${port}`)
})