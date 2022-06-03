import mongoose from "mongoose";
import Company from "../models/companyModel.js";
import Post from "../models/postModel.js";
import paginatedResults from "../utils/paginatedResults.js";

export const createPost = async (req, res) => {
  const user = await Company.findById(req.user.id).select("-password");
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    applicationDue: req.body.applicationDue,
    location: req.body.location,
    category: req.body.category,
    workTimeType: req.body.workTimeType,
    company: req.user.id,
    companyName: user.companyName,
  });
  try {
    let savedPost = await newPost.save();
    savedPost = savedPost.toObject();
    savedPost.company = user;
    return res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

function isValidObjectId(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    if ((String)(new mongoose.Types.ObjectId(id)) === id) { return true; }
    return false;
  }
  return false;
}

export const getPosts = async (req, res) => {
  try {
    if (req.query.id && (req.query.id == undefined || !isValidObjectId(req.query.id))) {
      const error = new Error("Invalid Id format provided");
      error.status = 400;
      throw error;
    }

    const posts = await paginatedResults(Post, req.query);

    if (!posts || !posts.results || posts.results.length == 0) {
      return res.status(404).json({ message: "No Posts found." });
    }
    return res.status(200).json(posts);
  } catch (error) {
    const status = error.status || 500;
    const message = status == 500 ? "Something went wrong" : error.message;
    return res.status(status).json({ message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("company", "-password");

    if (!post) {
      return res.status(404).json({ message: "Post with given id not found." });
    }

    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.company != req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update Your posts" });
    }
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      );
      return res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json(error);
    }
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.company != req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update Your posts" });
    }
    try {
      await post.delete();
      return res.status(200).json("Post has been deleted");
    } catch (error) {
      res.status(500).json("Something went wrong");
    }
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};
