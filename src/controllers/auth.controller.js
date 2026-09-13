import 'dotenv/config';
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
    
        if (existingUser) {
            return res.status(422).json({
                message: "User already exists with this email",
                status: "failed"
            });
        } 

        const newUser = await UserModel.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message: "User registered successfully",
            status: "success",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
        
    } catch (err) {
        console.error(`Error: ${err}`);
        
        res.status(500).json({
            message: err.message,
            status: "failed"
        });
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel
            .findOne({ email })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed"
            });
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed"
            });
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET);

        res.cookie("token", token);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                email: user.email
            },
            status: "success"
        });

    } catch (err) {
        console.error(`Error: ${err}`);

        res.status(500).json({
            message: err.message,
            status: "failed"
        });
    }
}