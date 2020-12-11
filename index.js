const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();

//Express App config
const app = express();
app.use(cors())
app.use(express.json())


//Database Connection
mongoose.connect(process.env.DB_CONNECTION,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log("Connected to database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

//Routers
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

//Router Middleware
app.use('/api/user', authRouter);
app.use('/api/user', profileRouter);

//Server
app.listen(5022, ()=>{
    console.log('Server is started');
});