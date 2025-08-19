const bcrypt = require('bcrypt');

// register User
const register = async (req, res)=>{
    try {
        const { name, email, password, role } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ message: 'Please fill all the required fields' });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'Invalid Credentails' });
        }

        const hashPassword = await bcrypt.hash( password, 10 );

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        });

        const newUser = user.toObject();
        delete newUser.password;

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered Successfully',
            user: newUser,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { register };