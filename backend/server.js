const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoUrI = 'mongodb://127.0.0.1/Authentication';
const mongoconnectsession = require('connect-mongodb-session')(session);
const port = 4000;
const app = express();

app.use(express.json())
app.use(cors({origin: "*"}))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

mongoose.connect(MongoUrI)
.then(()=>{
    console.log('MongoDb is connected succesfully')
})
.catch((error)=>{
    console.log('Failed to connect to mongodb', error)
})

const store = new mongoconnectsession({
    uri: MongoUrI,
    collection: "MongoSession"
})

app.use(
    session({
        secret: "key to sign to your cookie",
        resave: false,
        saveUninitialized: false,
        store: store
    })
)





app.get('/dashboard', (req, res)=>{
    res.render('index')
    req.session.isAuth = true
})






app.listen(port, ()=>{
    console.log(`The server is running on port : ${port}`)
})