const express = require('express');
const dbConnection = require('./config/db');
const { authRouter } = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();

// DB Connection
dbConnection();

app.use(express.json());

// cookie-parser
app.use(cookieParser());

// routes
app.use('/auth', authRouter);

app.get('/', (req, res)=>{
    res.send('Admin Panel Dashboard');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is connection on PORT ${ PORT }`);
});