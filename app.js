const express = require('express');
const dbConnection = require('./config/db');
const { authRouter } = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { adminUserRouter } = require('./routes/adminUserRoutes');
const { companyRouter } = require('./routes/companyRoutes');
const app = express();
require('dotenv').config();

// DB Connection
dbConnection();

app.use(express.json());

// cookie-parser
app.use(cookieParser());

// routes
app.use('/auth', authRouter);
app.use('/admin', adminUserRouter);
app.use('/company', companyRouter);

app.get('/', (req, res)=>{
    res.send('Admin Panel Dashboard');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is connection on PORT ${ PORT }`);
});