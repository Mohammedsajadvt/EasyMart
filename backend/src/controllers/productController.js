const Product = require('../models/Product');
const { isDbConnected } = require('../config/db');

// @desc    Fetch all products with filters, sorting, search directly from MongoDB Atlas
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 100000;
    const category = req.query.category && req.query.category !== 'All' ? req.query.category : null;
    const keyword = req.query.keyword ? req.query.keyword.trim() : null;

    const filterQuery = {
      price: { $gte: minPrice, $lte: maxPrice },
    };
    if (category) filterQuery.category = category;
    if (keyword) {
      filterQuery.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } },
      ];
    }

    let sort = {};
    if (req.query.sort === 'price_asc') sort = { price: 1 };
    else if (req.query.sort === 'price_desc') sort = { price: -1 };
    else if (req.query.sort === 'rating') sort = { rating: -1 };
    else sort = { createdAt: -1 };

    const products = await Product.find(filterQuery).sort(sort);

    res.json({
      products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products from MongoDB Atlas
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await Product.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(8);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get flash deals from MongoDB Atlas
// @route   GET /api/products/flash-deals
// @access  Public
const getFlashDeals = async (req, res) => {
  try {
    const deals = await Product.find({ isFlashDeal: true }).sort({ createdAt: -1 }).limit(6);
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get distinct product categories list from MongoDB Atlas
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID from MongoDB Atlas
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found in database' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product review in MongoDB Atlas
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully to product' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product in MongoDB Atlas (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      description,
      coverImage,
      images,
      category,
      brand,
      stock,
      isFeatured,
      isFlashDeal,
      tags,
      attributes,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      description: description || '',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      images: images && images.length > 0 ? images : [coverImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      category: category || 'Electronics',
      brand: brand || 'EasyMart',
      stock: stock !== undefined ? Number(stock) : 10,
      isFeatured: Boolean(isFeatured),
      isFlashDeal: Boolean(isFlashDeal),
      tags: Array.isArray(tags) ? tags : [],
      attributes: Array.isArray(attributes) ? attributes : [],
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product in MongoDB Atlas (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product from MongoDB Atlas (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product successfully deleted from MongoDB Atlas database' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getFlashDeals,
  getCategories,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
};
