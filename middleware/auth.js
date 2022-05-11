import jwt from "jsonwebtoken";
import User from "../models/companyModel.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("Kenan");
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      res.status(401).json("Not authorized to access this route");
    }
  }

  if (!token) {
    res.status(401).json("Not authorized, no token");
  }
};

export { protect };
