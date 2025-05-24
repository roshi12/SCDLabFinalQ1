const Blog = require('../models/Blog');
const View = require('../models/View');

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = new Blog({ title, content, author: req.userId });
    await blog.save();

    const blogView = new View({ blogId: blog._id });
    await blogView.save();

    res.status(201).json({ message: 'Blog created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increment blog views
exports.incrementViews = async (req, res) => {
  try {
    const { blogId } = req.params;
    const view = await View.findOne({ blogId });

    if (view) {
      view.views++;
      await view.save();
    } else {
      const newView = new View({ blogId, views: 1 });
      await newView.save();
    }

    res.status(200).json({ message: 'View count incremented' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
