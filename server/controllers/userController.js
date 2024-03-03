const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//registered user
const registeredUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            return next(new Error("All fields are required"));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400);
            return next(new Error("User already exists"));
        }

        const encryptedPassword = await bcrypt.hash(password, 10)
        await User.create({ name, email, password: encryptedPassword })

        res.status(200).json({
            status: "SUCCESS",
            message: "You are Registered Successfully. Please Log In to proceed further",
        })
    } catch (error) {
        res.status(400);
        return next(new Error(error.message));
    }

}

//login user
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            return next(new Error("All fields are required"));
        }
        const user = await User.findOne({ email });//user is mongoose object or mongodb object,so we need to convert it into json
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const jwtToken = jwt.sign({userId:user._id}, process.env.JWT_SECRET, { expiresIn: 60 * 60 }) // 1 hour
                res.status(200).json({
                    status: "SUCCESS",
                    name: user.name,
                    id: user._id,
                    message: "You are Logged In Successfully",
                    jwtToken
                })
            }
            else {
                res.status(400);
                return next(new Error("Invalid credentials"));
            }
        }
        else {
            res.status(400);
            return next(new Error("Invalid credentials"));
        }
    } catch (error) {
        console.log(error);
        res.status(400);
        next(new Error("Invalid credentials"));
    }

}

module.exports = { registeredUser, loginUser }