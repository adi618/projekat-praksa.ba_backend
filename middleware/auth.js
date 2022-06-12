/* eslint-disable prefer-destructuring */
import jwt from "jsonwebtoken";
import User from "../models/companyModel.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization
    && req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      req.token = token;
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = await User.findById(decoded._id);
      next();
    } catch (error) {
      res.status(401).json("Not authorized to access this route");
    }
  }

  if (!token) {
    res.status(401).json("Not authorized, no token");
  }
};

// eslint-disable-next-line import/prefer-default-export
export { protect };
