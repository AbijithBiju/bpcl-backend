const mongoose = require('mongoose')

uri = process.env.MONGODB_URI

mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected")
}).catch((err) => console.log(err))

