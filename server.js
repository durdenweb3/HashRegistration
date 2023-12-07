import { Schema, mongoose } from "mongoose";
import express from "express";
import path from "path";
import bcrypt from 'bcrypt'
import { config } from './config'

const app = express();
const PORT = 5001;

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const __dirname = path.dirname(new URL(import.meta.url).pathname);

mongoose.connect(config.dbConnect); // Go to config.js
const db = mongoose.connection;
db.on('error', console.log.bind(console, 'Error connection to MongoDB'))
db.once('open', () => {
    console.log('Connected to MongoDB!')
})

const userSchema = new Schema({
    username: String,
    password: String,
},);

const User = mongoose.model('User', userSchema, 'users')

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','index.html'))
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','login.html'))
});

const regData = async (login, password) => {
    try{
        const user = await User.findOne({username: login});

        if(user){
            return 'User already exist'
        }

        const hashPassword = await bcrypt.hash(password, 8);
        const newUser = new User({username: login, password: hashPassword});

        await newUser.save();

        console.log('User created successfully');        
    }catch(e){
        console.log(e);
    }
};

const loginData = async (login, password) => {
    try{
        const user = await User.findOne({username: login});

        if(!user){
            return 'User not found'
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return 'Wrong password'
        }

        console.log('User logged in successfully');        
    }catch(e){
        console.log(e);
    }
}

app.post('/reg', async (req, res) => {
    const { login, password } = req.body;
    try{
        await regData(login, password);
        res.send('Reg Data inserted successfully');
    }catch(e){
        console.log(e);
        res.status(500).send('Server error');
    }
});
app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try{
        await loginData(login, password);
        res.send('Logged in successfully');
    }catch(e){
        console.log(e);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is on ${PORT}`)
})