const SuperUser = require("../models/companySchema");
const bcrypt = require('bcrypt');
const generatePassword = require("../utils/generatePassword");
const Credentails = require("../models/credentailsSchema");

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

        const newUser = new SuperUser({
            name,
            ownerName,
            address,
            email,
            mobile,
            category,
            password: rawPassword,
            logo: logoUrl,
            image: imagesUrls,
            socialLinks: parsedSocialLinks
        });

        await newUser.save();

        const credentails = new Credentails({
            email: newUser.email,
            password: rawPassword
        });

        await credentails.save();

        res.status(201).json({
            message: "User Created Successfully",
            user: newUser
        });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

module.exports = { companyUser };