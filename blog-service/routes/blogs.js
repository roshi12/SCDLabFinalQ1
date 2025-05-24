const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');

router.post('/', auth, blogController.createBlog);
router.get('/', blogController.getBlogs);
router.post('/:blogId/views', blogController.incrementViews);

module.exports = router;
