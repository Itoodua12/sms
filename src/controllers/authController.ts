import { RequestHandler } from 'express';
import { RegisterRequestBody, LoginRequestBody } from '../dtos/auth';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/userModel"
import router from '../routes/authRoutes';


export const register: RequestHandler<{}, any, RegisterRequestBody> = async (req, res) => {
    try {
        const { email, firstName, lastName, password, role } = req.body;

        if (!email || !firstName || !lastName || !password || !role) {
            res.status(400).json({
                result: "error",
                message: "required fiels are missing"
            });
            return;
        }
        const user = await User.findOne({ email })
        if (user) {
            res.status(409).json({ "message": "user already exists" });
            return;
        }

        console.log(req.body)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            role
        })
        await newUser.save();
        res.status(201).json('User registered')
    } catch (err) {
        console.log(err)
        res.status(500).json('internal server error');
    }
};

export const login: RequestHandler<{}, any, LoginRequestBody> = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                result: "error",
                message: "required fiels are missing"
            });
            return;
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: `User with email ${email} not found` });
            return;
        }
        var isMatch: Boolean = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json({ message: `Invalid Credentials` });
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        res.status(200).json({ token });
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "something went wrong"});
    }
};
