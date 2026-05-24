import { validationResult } from "express-validator";
import User from '../models/User.js';
import generateToken from "../utils/generateToken.js";

export const registerUser= async(req,res,next)=>{
    try{
        const errors= validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                errors: errors.array()
            });
        }
        const{
            name,email,password
        }=req.body;

        const existingUser= await User.findOne({email})

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Existing User"
            })
        }

        const user= await User.create({
            name, email, password
        });

        res.status(201).json({
            success:true,
            message:"User Created",
            user:{
            id: user._id,
            name: user.name,
            email:user.email,
            role:user.role
            },
            token: generateToken(user._id)
        });
    }catch(error){
        next(error)
    }
};

export const loginUser =
  async (req, res, next) => {
    try {
      const errors =
        validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const {
        email,
        password
      } = req.body;

      const user =
        await User.findOne({ email });

      if (
        user &&
        (await user.matchPassword(
          password
        ))
      ) {
        return res.status(200).json({
          success: true,

          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },

          token:
            generateToken(user._id)
        });
      }

      return res.status(401).json({
        success: false,
        message:
          'Invalid credentials'
      });
    } catch (error) {
      next(error);
    }
  };


// Get Current User
export const getMe =
  async (req, res, next) => {
    try {
      const user =
        await User.findById(
          req.user.id
        ).select('-password');

      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
    }
  };