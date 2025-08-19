const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startswith('Bearer ')){
            return res.status(401).json({ message: 'No Token Provided' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        console.log('Error while auth', err.message);
        return res.status(401).json({ message: 'Invalid or Expired Token' });
    }
};

module.exports = { authMiddleware };