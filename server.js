require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 3000
const app = express()

const cors=require('cors');
const options = {
  "Access-Control-Allow-Origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}

app.use(cors());
app.options('*',cors());

const bodyParser = require('body-parser')



app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json())

const UserRouter = require('./api/User')

app.use('/user',UserRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})