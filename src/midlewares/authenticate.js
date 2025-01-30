import EHttpStatusCode from "../enums/HttpStatusCode.js";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

const authMiddleware = (req, res, next) => {
  try {
    // Extract the token from headers
   
    let token = req.headers.authorization;

    // Check if the token exists
    if (!token || token === "undefined") {
      return res
        .status(EHttpStatusCode.UNAUTHORIZED)
        .json({ message: "Not Authorized!" });
    }

    // Split the "Bearer" prefix from the actual token
    token = token.split(" ")[1];

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Set the user details in request object
    req.user = decoded // Ensure this is consistent with how you use it elsewhere
    next();
  } catch (error) {
    console.log('Error in authentication middleware:', error);

    // Handle specific token errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(EHttpStatusCode.UNAUTHORIZED)
        .json({ message: "Token expired!" });
    }

    if (error.name === "JsonWebTokenError") {
      return res
        .status(EHttpStatusCode.UNAUTHORIZED)
        .json({ message: "Invalid token!" });
    }

    // Handle other errors
    return res
      .status(EHttpStatusCode.INTERNAL_SERVER)
      .json({ message: "Internal Serverdsdsds Error!" });
  }
};

export default authMiddleware;
