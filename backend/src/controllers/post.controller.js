import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const create = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(new ApiError(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  const savedPost = await newPost.save();
  res.status(201).json(new ApiResponse(200, "post created!", savedPost));
});

const getposts = asyncHandler(async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const posts = await Post.find({
    ...(req.query.userId && { userId: req.query.userId }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.slug && { slug: req.query.slug }),
    ...(req.query.postId && { _id: req.query.postId }),
    ...(req.query.searchTerm && {
      $or: [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ],
    }),
  })
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  const now = new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthPosts = await Post.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  const post_author_id=posts[0].userId;

  const post_author=await User.findById(post_author_id);
  
  res.status(200).json(
    new ApiResponse(200, {
      posts,
      post_author,
      totalPosts,
      lastMonthPosts,
    })
  );
});

const deletepost = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(new ApiError(403, "You are not allowed to delete this post"));
  }

  await Post.findByIdAndDelete(req.params.postId);
  res.status(200).json(new ApiResponse(200, "The post has been deleted"));
});

const updatepost = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(new ApiError(403, "You are not allowed to update this post"));
  }
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      },
    },
    { new: true }
  );
  res.status(200).json(new ApiResponse(200, updatedPost));
});

export { create, getposts, deletepost, updatepost };
