const mongoose = require('mongoose');

const dbConnection = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.log(`Something went wrong`, err.message);
        process.exit(1);
    }
};

module.exports = dbConnection;