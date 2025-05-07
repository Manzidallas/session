const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const port = 5000
const app = express()
const user = require('./models/User')


app.use(express.json())
app.use(cors({origin: "*"}))

mongoose.connect('mongodb://127.0.0.1/SessionTest')
.then(()=>{
    console.log('Connected To MongoDB succesfully')
})
.catch((error)=>{
    console.log('Failed to connect to MongoDB', error)
})

app.post('/register', async (req ,res)=>{

    const {username, email, password } = req.body

    try {
        const hashedpassword = await bcrypt.hash(password, 12)
        const newUser = await user(
            {
                username: username,
                email: email,
                password: hashedpassword 
            },
        )
        newUser.save();

        if(newUser){
            res.status(201).json({message: "User registered succesffully", user : newUser})
        }else{
            res.json({message: "User failed to register", user : newUser})
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Err", user : newUser})
    }
})

app.post('/login', async (req, res)=>{
    const {email , password} = req.body

    const findUser = await user.findOne({email})
    if(!findUser){
        return res.status(404).json({message : 'User was not found'})
    }

    // res.status(200).json({message : 'User was found + true'})
    const comparepassword = await bcrypt.compare(password, (findUser.password))
    if(comparepassword){
        res.status(200).json({message: "Password Matches", password: comparepassword})
    }else{
        res.json({message: "Passwords Don't Match", password: comparepassword});
    }

})

app.listen(port, ()=>{
    console.log(`The server is running on port ${port}`) 
})