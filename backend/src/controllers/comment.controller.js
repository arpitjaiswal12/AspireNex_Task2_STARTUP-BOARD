import Comment from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res, next) => {
  const { content, postId } = req.body;
  const userId = req.user.id; // Use the authenticated user's ID from req.user

  const newComment = new Comment({
    content,
    postId,
    userId,
  });
  await newComment.save();

  res.status(200).json(new ApiResponse(200, "Comment created successfully!", newComment));
});

const getPostComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({
    createdAt: -1,
  });
  res.status(200).json(new ApiResponse(200, "get commnets", comments));
});

const likeComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return new ApiError(404, "Comment not found");
  }
  const userIndex = comment.likes.indexOf(req.user.id);
  if (userIndex === -1) {
    comment.numberOfLikes += 1;
    comment.likes.push(req.user.id);
  } else {
    comment.numberOfLikes -= 1;
    comment.likes.splice(userIndex, 1);
  }
  await comment.save();
  res.status(200).json(new ApiResponse(200, "like comments !", comment));
});

const editComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return new ApiError(404, "Comment not found");
  }
  if (comment.userId !== req.user.id) {
    return next(new ApiError(403, "You are not allowed to edit this comment"));
  }

  const editedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      content: req.body.content,
    },
    { new: true }
  );
  res.status(200).json(new ApiResponse(200, "comment edited !", editedComment));
});

const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(new ApiError(404, "Comment not found"));
  }
  if (comment.userId !== req.user.id ) {
    return next(
      new ApiError(403, "You are not allowed to delete this comment")
    );
  }
  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(200).json(new ApiResponse(200, "Comment has been deleted"));
});


export {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment
};
