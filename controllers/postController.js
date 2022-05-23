/* eslint-disable no-unused-expressions */
import Company from "../models/companyModel.js";
import Post from "../models/postModel.js";

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
    seniority: req.body.seniority,
    workTimeType: req.body.workTimeType,
    workLocationType: req.body.workLocationType,
    technologies: req.body.technologies,
    company: req.user.id,
    companyName: user.companyName,
  });
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

async function filter(query) {
  const qry = {};
  query.id && (qry.company = query.id);
  query.city && (qry.location = query.city);
  query.cat && (qry.category = query.category);

  const posts = await Post.find(qry);
  return posts;
}

export const getPosts = async (req, res) => {
  try {
    let posts;
    if (req.query.search) {
      // search
      posts = await Post.find({
        $or: [
          { title: { $regex: req.query.search } },
          { location: { $regex: req.query.search } },
          { companyName: { $regex: req.query.search } },
        ],
      });
      if (!(Object.keys(req.query).length === 0)) {
        // search and queries
        posts = await filter(req.query);
      }
    } else if (!(Object.keys(req.query).length === 0)) {
      // querries
      posts = await filter(req.query);
    } else {
      posts = await Post.find();
    }

    if (!posts || posts.length == 0) {
      return res.status(404).json({ message: "No Posts found." });
    }
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post with given id not found." });
    }

    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
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
    res.status(500).json(error);
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
      res.status(500).json(error);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
