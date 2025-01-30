// controllers/auth.js
import UserModel from '../models/users.js' 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import EHttpStatusCode from "../enums/HttpStatusCode.js";

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(EHttpStatusCode.BAD_REQUEST)
          .json({ message: "Email and password are required" });
      }

      const user = await UserModel.findOne({ email });
      
      if (!user) {
        return res.status(EHttpStatusCode.NOT_FOUND)
          .json({ message: "No account found with this email" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(EHttpStatusCode.UNAUTHORIZED)
          .json({ message: "Invalid password" });
      }

      const userObject = user.toObject();
      delete userObject.password;

      const token = jwt.sign(
        { ...userObject },
        process.env.SECRET_KEY,
        { expiresIn: "30d" }
      );

      return res.status(EHttpStatusCode.SUCCESS).json({
        message: "Login successful",
        token,
        user: { ...userObject }
      });

    } catch (error) {
      console.error("Login error:", error);
      return res.status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ message: "Login failed. Please try again" });
    }
  },

 register: async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log('Registration attempt:', { name, email });

    if (!name || !email || !password || !confirmPassword) {
      return res.status(EHttpStatusCode.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(EHttpStatusCode.BAD_REQUEST)
        .json({ message: "Passwords do not match" });
    }

    // Check for existing user by email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(EHttpStatusCode.CONFLICT)
        .json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword
    });

    try {
      await newUser.save();
      
      return res.status(EHttpStatusCode.CREATED)
        .json({ message: "Registration successful" });
    } catch (saveError) {
      console.error('Save error:', saveError);
      
      // More detailed error handling
      if (saveError.code === 11000) {
        return res.status(EHttpStatusCode.CONFLICT)
          .json({ message: "Duplicate key error. This email may already be registered." });
      }
      
      throw saveError; // Re-throw other errors
    }

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(EHttpStatusCode.INTERNAL_SERVER)
      .json({ message: "Registration failed. Please try again" });
  }
},

 forgotPassword: async (req, res) => {
   try {
     const { email } = req.body;

     if (!email) {
       return res.status(EHttpStatusCode.BAD_REQUEST)
         .json({ message: "Email is required" });
     }

     const user = await UserModel.findOne({ email });
     if (!user) {
       return res.status(EHttpStatusCode.NOT_FOUND)
         .json({ message: "No account found with this email" });
     }

     // Add password reset logic here
     // Generate reset token, send email, etc.

     return res.status(EHttpStatusCode.SUCCESS)
       .json({ message: "Password reset instructions sent to your email" });

   } catch (error) {
     console.error("Forgot password error:", error);
     return res.status(EHttpStatusCode.INTERNAL_SERVER)
       .json({ message: "Password reset failed. Please try again" });
   }
 }
};

export default authController;