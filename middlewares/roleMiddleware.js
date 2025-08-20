
const authorizedRoles = (req, res, next)=>{
    try {
        const userRole = req.user.role;

        if(userRole === 'Admin'){
            return next();
        }

        return res.status(403).json({ message: 'You are not authorized for this role' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { authorizedRoles };