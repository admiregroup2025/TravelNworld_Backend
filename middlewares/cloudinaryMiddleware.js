const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        console.log('Uploading file:', file.originalname); // Debug log
        return {
            folder: 'user-uploads',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            resource_type: 'auto',
            // Optionally add a public_id for better file naming
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
        };
    }
});

// Add error handling
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

module.exports = upload;