import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/companyModel.js";
import sendEmailVerification from "../utils/email.js";

export const register = async (req, res) => {
  const {
    companyName, profilePhoto, email, password, confirmPassword, industry,
  } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({ message: "User already exist." });
    }
    // eslint-disable-next-line
    const emailRegex =
      // eslint-disable-next-line
      /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/;

    const valid = emailRegex.test(email);
    if (!valid) return res.status(400).json({ message: "Invalid email" });

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const profilePicture = req.file ? req.file.path : "";
    const newUser = new User({
      companyName,
      profilePhoto: profilePicture,
      email,
      password: hashedPass,
      industry,
    });

    const addedUser = await newUser.save();

    const user = {
      _id: addedUser.id,
      companyName,
      profilePhoto,
      email,
      industry,
    };
    const token = jwt.sign(user, process.env.TOKEN_SECRET);
    sendEmailVerification(user);

    return res.status(200).json({ user, token, message: "A confirmation link has been sent to Your email. Please confirm Your email to proceed to login" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!existingUser.isEmailConfirmed) {
      return res.status(401).json({ message: "Please verify Your email to login" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const {
      _id, companyName, profilePhoto, industry, isEmailConfirmed,
    } = existingUser;

    const user = {
      _id,
      companyName,
      profilePhoto,
      email,
      industry,
      isEmailConfirmed,
    };

    const token = jwt.sign(user, process.env.TOKEN_SECRET);

    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req;
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const confirmEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    await User.findByIdAndUpdate(decoded._id, { isEmailConfirmed: true }, { strict: false });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
  return res.redirect('http://localhost:3000/api/login');
};
