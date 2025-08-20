const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    mobile: {
        type: Number,
        required: true,
        required: true
    },
    category: {
        type: String
    },
    logo: {
        type: String
    },
    image: {
        type: [ String ]
    },
    password: {
        type: String,
        required: true,
    },
    socialLinks: {
        facebook: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?facebook\.com\/.+$/, 'Please enter a valid Facebook URL']
        },
        instagram: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?instagram\.com\/.+$/, 'Please enter a valid Instagram URL']
        }
    }
},{ timestamps: true });

const SuperUser = mongoose.model('SuperUser', userSchema);

module.exports = SuperUser;