const mongoose = require('mongoose');

const credentialsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true  
    }
});

const Credentails = mongoose.model('Credentails', credentialsSchema);

module.exports = Credentails;