const SuperUser = require("../models/companySchema");
const bcrypt = require('bcrypt');
const generatePassword = require("../utils/generatePassword");
const Credentails = require("../models/credentailsSchema");
const transporter = require("../config/mailer");
const jwt = require('jsonwebtoken');

// register User and generate password for User
const companyUser = async (req, res) => {
    try {
        const { name, ownerName, address, email, mobile, category, socialLinks } = req.body;

        const logoUrl = req.files?.logo ? req.files.logo[0].path : null;
        const imagesUrls = req.files?.images ? req.files.images.map(file => file.path) : [];

        // Social Links setup
        let parsedSocialLinks = {};
        if (socialLinks) {
            try {
                parsedSocialLinks = JSON.parse(socialLinks);
            } catch (error) {
                parsedSocialLinks = socialLinks;
            }
        }

        const rawPassword = generatePassword(8);

        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const newUser = new SuperUser({
            name,
            ownerName,
            address,
            email,
            mobile,
            category,
            password: hashedPassword,
            logo: logoUrl,
            image: imagesUrls,
            socialLinks: parsedSocialLinks
        });

        await newUser.save();

        const credentails = new Credentails({
            email: newUser.email,
            password: hashedPassword
        });

        await credentails.save();


        // await transporter.sendMail({
        //     from: process.env.EMAIL_USER,
        //     to: email,
        //     subject: "Your Account Credentials",
        //     html: `
        //         <h2>Hello ${name},</h2>
        //         <p>Your account has been created successfully.</p>
        //         <p><strong>Email:</strong> ${email}</p>
        //         <p><strong>Password:</strong> ${rawPassword}</p>
        //         <br/>
        //         <p>Please keep it safe and change it after login.</p>
        //     `,
        // });

        res.status(201).json({
            message: "User Created Successfully",
            user: newUser
        });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

// Login API
const loginUser = async (req, res)=>{
    try {
        const { email, password } = req.body;

        // Check user exists
        const user = await SuperUser.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const comparePassword = await bcrypt.compare(password, user.password);
        if(!comparePassword){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ 
            message: 'Login Successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "User"
            }
        });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

// Update details
const updateUser = async (req, res)=>{
    try {
        const { id } = req.params;

        const { email, ...updates } = req.body;

        if(req.files?.logo){
            updates.logo = req.files.logo[0].path;
        }

        if(req.files?.images){
            updates.image = req.files.images.map(file => file.path);
        }

        const updatedUser = await SuperUser.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if(!updatedUser){
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

module.exports = { companyUser, loginUser, updateUser };