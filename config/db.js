const mongoose = require('mongoose')

uri = 'mongodb+srv://bpcl_mediclaim_app:OWddEawfcaTtuBKi@cluster0.rnllksm.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected")
}).catch((err) => console.log(err))

