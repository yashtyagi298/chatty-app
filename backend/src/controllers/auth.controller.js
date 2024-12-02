import { generateToken } from "../lib/utlis.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {z} from "zod";
import cloudinary from "../lib/cloudinary.js";
const signupSchema=z.object({
    fullname:z.string().min(4,"Full name is required"),
    email:z.string().email("Invalid email address"),
    password:z.string().min(6,"Password must be at least 6 characters")
});
export const signup = async (req, res) => {
   try {

    const {fullname,email,password} = signupSchema.parse(req.body);
   
    const user = await User.findOne({email});
    if(user) return res.status(400).json({message:"Email is already exists"});
    
    // hashing 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
        fullname,
        email,
        password:hashedPassword
    });

    if(newUser){
        // generate jwt token here 
        generateToken(newUser.id,res)
        await newUser.save();
        
        res.status(201).json({
            _id:newUser._id,
            fullname:newUser.fullname,
            email:newUser.email,
            profilePic:newUser.profilePic
        })
    }else{
        res.status(400).json({message:"Invalid user Data"});
    }
   } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
   }
}

const loginSchema=z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(6,"Password must be at least 6 characters")
});
export const login = async (req, res) => {
   try {
    const parsedResult = loginSchema.safeParse(req.body);
    if (!parsedResult.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: parsedResult.error.errors.map((err) => err.message),
        });
    }
    const { email, password } = parsedResult.data;

        const user = await User.findOne({ email });
     
        
        if(!user){
            return res.status(404).json({message:"Invalid Email "});
        }
        const isPasswordValid= await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid Password"});
        }
        // generate token 
        generateToken(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilePic:user.profilePic
        });
   } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
   }
}

export const logout = (req, res) => {
   try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out Successfully"});
   } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
   }
};

export const updateProfile = async (req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
      
        if(!profilePic){
            return res.status(400).json({message:"Profile Pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser =  await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new:true}
        );
        res.status(200).json(updateUser);

    } catch (error) {
         console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
    }
}

export const authCheck = async (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

