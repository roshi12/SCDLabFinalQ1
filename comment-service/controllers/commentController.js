const Comment = require('../models/Comment');

// Create Comment
exports.createComment = async (req, res) => {
  try {
    const { content, blogId } = req.body;
    const comment = new Comment({
      content,
      blogId,
      author: req.userId
    });
    await comment.save();
    res.status(201).json({ message: 'Comment created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Comments by Blog ID
exports.getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blogId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
