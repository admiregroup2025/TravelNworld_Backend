const bcrypt = require('bcrypt');
const User = require('../models/authSchema');
const jwt = require('jsonwebtoken');

// register User
const register = async (req, res)=>{
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ message: 'Please fill all the required fields' });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'Invalid Credentails' });
        }

        const hashPassword = await bcrypt.hash(password, 10 );

        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'Admin' : 'User';

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

        // set the jwt in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000
        });


        res.status(201).json({
            message: 'User registered Successfully',
            user: newUser,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// login User
const login = async (req, res)=>{
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: 'Invalid Credentails' });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ message: 'Invalid Credentails' });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            return res.status(404).json({ message: 'Invalid Credentails' });
        }

        const userObj = user.toObject();
        delete userObj.password;

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // set the token in the cookies
        res.cookie('token',  token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({ 
            message: 'Login Successfully',
            user: userObj
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// logout the User  
const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })        

        res.status(200).json({ message: 'User Logged Out successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { register, login, logout };