import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/companyModel.js";

export const register = async (req, res) => {
  const {
    companyName, profilePhoto, email, password, confirmPassword,
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

    const newUser = new User({
      companyName,
      profilePhoto: req.file.path,
      email,
      password: hashedPass,
    });

    const addedUser = await newUser.save();

    const user = {
      id: addedUser.id,
      companyName,
      profilePhoto,
      email,
    };

    const token = jwt.sign(user, process.env.TOKEN_SECRET);

    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { id, companyName, profilePhoto } = existingUser;
    const user = {
      id,
      companyName,
      profilePhoto,
      email,
    };

    const token = jwt.sign(user, process.env.TOKEN_SECRET);

    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
