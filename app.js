const express = require('express');
const dbConnection = require('./config/db');
const { authRouter } = require('./routes/userRoutes');
const app = express();
require('dotenv').config();

// DB Connection
dbConnection();

app.use(express.json());

// routes
app.use('auth', authRouter);

app.get('/', (req, res)=>{
    res.send('Admin Panel Dashboard');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is connection on PORT ${ PORT }`);
});