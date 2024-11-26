require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import ejs from 'ejs';
import path from 'path';
import sendMail from "../utils/sendEmail";

interface RegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

// Register a new user
export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("User already exists", 400));
      }
      const user:RegistrationBody = { name, email, password};
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = {user:{name:user.name}, activationCode};
      const html = await ejs.renderFile(path.join(__dirname,"../mails/activation-mail.ejs"),data);


      try{
        await sendMail({
            email: user.email,
            subject: "Activate Your Account",
            template: "activation-mail.ejs",
            data,
        });
        res.status(201).json({
            success: true,
            message: `Please check your email: ${user.email} to activate your accoun..!`,
            activationToken: activationToken.token,
        })
      }catch(err:any){
        return next(new ErrorHandler(err.message,400));
      }
    } catch (err: any) {
        return next(new ErrorHandler("Failed to register user", 500));
    }
  }
);

interface ActivationToken{
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any):ActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({
        user,activationCode
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
        expiresIn: "1h"
    }
);

 return {token, activationCode};
}