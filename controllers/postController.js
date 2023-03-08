// eslint-disable-next-line import/named
import Company from "../models/companyModel.js";
import Post from "../models/postModel.js";
import { catchError, isValidObjectId, throwError } from "../utils/error.js";
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

export const getPosts = async (req, res) => {
  try {
    if (req.query.id && !isValidObjectId(req.query.id)) { throwError(400, "Invalid Id format provided"); }

    const posts = await paginatedResults(Post, req.query);

    if (!posts || !posts.results || posts.results.length == 0) {
      return res.status(404).json({ message: "No Posts found." });
    }
    return res.status(200).json(posts);
  } catch (error) {
    const response = catchError(error);
    return res.status(response.status).json({ message: response.message });
  }
};

export const getPost = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) throwError(400, "Invalid Id format provided");

    const post = await Post.findById(req.params.id).populate("company", "-password");
    if (!post) {
      return res.status(404).json({ message: "Post with given id not found." });
    }

    return res.status(200).json(post);
  } catch (error) {
    const response = catchError(error);
    return res.status(response.status).json({ message: response.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) throwError(400, "Invalid Id format provided");

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
      res.status(500).json({ message: "Something went wrong" });
    }
  } catch (error) {
    const response = catchError(error);
    return res.status(response.status).json({ message: response.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) throwError(400, "Invalid Id format provided");

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
      res.status(500).json({ message: "Something went wrong" });
    }
  } catch (error) {
    const response = catchError(error);
    return res.status(response.status).json({ message: response.message });
  }
};
