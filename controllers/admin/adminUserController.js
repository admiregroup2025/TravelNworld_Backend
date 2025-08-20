const User = require("../../models/authSchema");
const bcrypt = require('bcrypt');

// Create the User
const adminCreateUser = async (req, res)=>{
    try {
        const { name, email, password, role } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ message: 'Please fill all the required fields' });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'Invalid Credentails' });
        }

        const hashPassword = await bcrypt .hash(password, 10 );

        if (role && role !== "User") {
           return res.status(403).json({ message: "Admins can only create Users" });
        }

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        });

        const newUser = user.toObject();
        delete newUser.password;

        res.status(201).json({
            message: 'User registered Successfully',
            user: newUser,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Delete the User
const deleteUserByAdmin = async (req, res)=>{
    try {
        const { id } = req.params;
        if(!id){
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        if(user.role === 'Admin' || user.role == 'SuperAdmin'){
            return res.status(403).json({ message: "Admins cannot delete Admins or SuperAdmins" });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ message: 'User deleted Successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { adminCreateUser, deleteUserByAdmin };