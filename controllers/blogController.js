const Blog = require('../models/Blog');

// Create new blog post
exports.createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all blog posts with pagination
exports.getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments({ status: 'published' });
    const totalPages = Math.ceil(totalBlogs / limit);

    res.json({ blogs, totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Search blog posts by title, content, or tags
exports.searchBlogs = async (req, res) => {
  const searchTerm = req.query.q;
  try {
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } }
      ]
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get related blog posts by category or tag
exports.getRelatedBlogs = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      categories: { $in: blog.categories },
    }).limit(3);
    res.json(relatedBlogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
