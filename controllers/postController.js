import Company from "../models/companyModel.js";
import Post from "../models/postModel.js";

export const createPost = async (req, res) => {
  const user = await Company.findById(req.user.id).select("-password");
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    duration: req.body.duration,
    location: req.body.location,
    category: req.body.category,
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

function filter(data, query) {
  let posts;
  if (query.id && query.category && query.city) {
    posts = data.filter(
      (p) =>
        p.company == query.id &&
        p.location == query.city &&
        p.category == query.category
    );
  } else if (query.id && query.category) {
    posts = data.filter(
      (p) => p.company == query.id && p.category == query.category
    );
  } else if (query.id && query.city) {
    posts = data.filter(
      (p) => p.company == query.id && p.location == query.city
    );
  } else if (query.category && query.city) {
    posts = data.filter(
      (p) => p.location == query.city && p.category == query.category
    );
  } else if (query.id) {
    posts = data.filter((p) => p.company == query.id);
  } else if (query.city) {
    posts = data.filter((p) => p.location == query.city);
  } else if (query.category) {
    posts = data.filter((p) => p.category == query.category);
  }
  return posts;
}

export const getPosts = async (req, res) => {
  const category = req.query.cat;
  const id = req.query.id;
  const city = req.query.city;
  const search = req.query.search;
  try {
    let posts;
    if (search) {
      // search
      console.log("2");
      posts = await Post.find({
        $or: [
          { title: { $regex: req.query.search } },
          { location: { $regex: req.query.search } },
          { companyName: { $regex: req.query.search } },
        ],
      });
      if (category != null || id != null || city != null) {
        //search and queries
        posts = filter(posts, req.query);
      }
    } else if (category != null || id != null || city != null) {
      // querries
      let data = await Post.find();
      posts = filter(data, req.query);
    } else {
      posts = await Post.find();
    }

    if (!posts) {
      return res.status(404).json({ message: "No Posts found." });
    }

    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
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
    if (post.company != req.user.id)
      return res
        .status(403)
        .json({ message: "You can only update Your posts" });
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
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
    if (post.company != req.user.id)
      return res
        .status(403)
        .json({ message: "You can only update Your posts" });
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
