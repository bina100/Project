const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');

const router = require('./routes/api')
const {setAPstatus} = require('./controllers/AdvertisingPoint')
app.use(bodyParser.json())
app.use(cors())
app.use(router)
app.use('/public/uploads', express.static(path.join(__dirname, './public/uploads')))
app.use('/', router)


const connectionParams = {
  useNewUrlParser: true,
  //  useCreateIndex:true,
  useUnifiedTopology: true
}
mongoose.connect('mongodb://localhost:27017', connectionParams)
  .then(() => console.log("coneccted to DB"))
  .catch(err => console.log(err))

app.listen(4000, () => console.log("listening port 4000"))

setAPstatus()