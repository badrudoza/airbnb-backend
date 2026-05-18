import genToken from "../config/token.js"
import User from "../model/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req,res) => {

    try {

        let {name,email,password} = req.body;

        let existUser = await User.findOne({email});

        if(existUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        let hashPassword = await bcrypt.hash(password,10);

        let user = await User.create({
            name,
            email,
            password: hashPassword
        });

        let token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
         });

        const userData = await User.findById(user._id)
        .select("-password");

        return res.status(201).json(userData);

    } catch (error) {

        return res.status(500).json({
            message:`signup error ${error.message}`
        });
    }
}
export const login = async (req,res) => {
    try {

        let {email,password} = req.body;

        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"User does not exist"
            });
        }

        let isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
                message:"Incorrect Password"
            });
        }

        let token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
         });

        const userData = await User.findById(user._id)
        .select("-password")
        .populate(
            "listing",
            "title image1 image2 image3 description rent category city landMark"
        );

        return res.status(200).json(userData);

    } catch (error) {

        return res.status(500).json({
            message:`login error ${error.message}`
        });
    }
}
export const logOut = async (req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Logout Successfully"})
    } catch (error) {
        return res.status(500).json({message:`logout error ${error}`})
    }
}