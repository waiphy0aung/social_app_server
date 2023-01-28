import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register

export const register = async (req,res) => {
    try {

        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impression: Math.floor(Math.random() * 10000),
        })

        const saveUser = await newUser.save();
        res.status(201).json({
            success: true,
            payload: {
                saveUser
            },
            error: null
        });

    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

export const login = async (req,res) => {
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email : email});
        if(!user) return res.status(400).json({msg: "Email or Password is invalid"});

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch) return res.status(400).json({msg: "Email or Password is invalid"});

        const token = jwt.sign({id : user._id},process.env.JWT_SECRET);
        delete user.password;

        res.status(201).json({
            success: true,
            payload: {
                token,
                user
            },
            error: null
        });
    } catch (err) {
        res.status(500).json({error : err.message});
    }
}