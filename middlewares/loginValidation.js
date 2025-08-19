const joi = require('joi');

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$"))
        .required()
        .messages({
        "string.pattern.base": "Password must be 8-20 chars, include uppercase, lowercase, number, and special character"
    })
});

const loginValidation = async (req, res, next)=>{
    const { error } = loginSchema.validate(req.body);

    if(error){
        return res.status(400).json({ message: 'Invalid Input', details: error.details });
    }

    next();
};

module.exports = { loginValidation };