const express = require('express');
const { companyUser } = require('../controllers/companyController');
const upload = require('../middlewares/cloudinaryMiddleware');
const companyRouter = express.Router();

// Add error handling middleware
companyRouter.post('/companyUser', 
    (req, res, next) => {
        next();
    },
    upload.fields([ 
        { name: 'logo', maxCount: 1 },
        { name: 'images', maxCount: 10 }, // Added maxCount for images
    ]),
    (error, req, res, next) => {
        if (error) {
            console.error('Upload error:', error);
            return res.status(400).json({ message: 'File upload error', error: error.message });
        }
        next();
    },
    companyUser
);

module.exports = { companyRouter };