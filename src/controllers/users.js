import userModel from "../models/users.js";
import bcrypt from "bcrypt";
import EHttpStatusCode from "../enums/HttpStatusCode.js";
import { buildQueryOptions } from "../utilities/utilityFunctions.js";

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const searchableFields = ["name", "email"]; // Adjust as per your schema
      const { whereClause, options } = buildQueryOptions(
        req.query,
        searchableFields
      );
      const users = await userModel.find(whereClause, null, options);
      return res
        .status(EHttpStatusCode.SUCCESS)
        .json({ success: true, data: users });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res
        .status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  getUserById: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res
          .status(EHttpStatusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });
      }
      return res
        .status(EHttpStatusCode.SUCCESS)
        .json({ success: true, data: user });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res
        .status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  createUser: async (req, res) => {
    try {
      const { Name, userName, email, password, role, imageUrl } = req.body;

      const existingUser = await userModel.findOne({
        $or: [{ userName }, { email }],
      });
      if (existingUser) {
        if (existingUser.userName === userName) {
          return res
            .status(EHttpStatusCode.BAD_REQUEST)
            .json({ message: "This Username is already taken" });
        } else {
          return res
            .status(EHttpStatusCode.BAD_REQUEST)
            .json({ message: "This Email is already Registered" });
        }
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new userModel({
        Name,
        userName,
        email,
        password: hashedPassword,
        role,
        imageUrl,
      });
      await newUser.save();
      return res
        .status(EHttpStatusCode.CREATED)
        .json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      return res
        .status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ message: "Internal Server Error!" });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.params.id;
    const { password, ...otherData } = req.body;

    try {
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        otherData.password = hashedPassword;
      }
      const updatedUser = await userModel.findByIdAndUpdate(userId, otherData, {
        new: true,
      });
      if (!updatedUser) {
        return res
          .status(EHttpStatusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });
      }
      return res
        .status(EHttpStatusCode.SUCCESS)
        .json({
          success: true,
          message: "User updated successfully",
          data: updatedUser,
        });
    } catch (error) {
      console.error("Error updating user:", error);
      return res
        .status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await userModel.findByIdAndRemove(userId);
      if (!deletedUser) {
        return res
          .status(EHttpStatusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });
      }
      return res
        .status(EHttpStatusCode.SUCCESS)
        .json({
          success: true,
          message: "User deleted successfully",
          data: deletedUser,
        });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res
        .status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  updateProfile: async (req, res) => {
    const userId = req.user._id; // User ID from decoded token
    const updateData = req.body; 
 
    try {
      // Find the user and update their profile, return the updated user
      const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
        new: true, // Return the updated document
      });
  
      // Check if the user exists
      if (!updatedUser) {
        return res
          .status(EHttpStatusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });
      }
  
      // Convert the Mongoose document to a plain object and remove password field
      const userObject = updatedUser.toObject();
      delete userObject.password; // Remove the password field
  
      return res.status(EHttpStatusCode.SUCCESS).json({
        success: true,
        message: "Profile updated successfully",
        data: userObject,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res
        .status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  

  updatePassword: async (req, res) => {
    const userId = req.user._id; // User ID from decoded token
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res
          .status(EHttpStatusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(EHttpStatusCode.BAD_REQUEST)
          .json({ success: false, message: "Incorrect current password" });
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(EHttpStatusCode.BAD_REQUEST)
          .json({
            success: false,
            message: "New password and confirm password do not match",
          });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedNewPassword;
      await user.save();

      return res
        .status(EHttpStatusCode.SUCCESS)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      return res
        .status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  updateProfilePic: async (req, res) => {
    const userId = req.user._id; // User ID from decoded token
    const { imageUrl } = req.body; // Assuming the image URL is provided in the request body

    try {
    

      // Find the user and update the profile picture
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { imageUrl },
        { new: true }
      );

      // Check if the user exists
      if (!updatedUser) {
        return res
          .status(EHttpStatusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });
      }

      // Remove the password field from the updated user object
      const { password, ...userWithoutPassword } = updatedUser.toObject();

      return res.status(EHttpStatusCode.SUCCESS).json({
        success: true,
        message: "Profile picture updated successfully",
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      return res
        .status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
};

export default userController;
