const Category = require('../models/Category');
const { inMemoryCategories, inMemoryProducts } = require('../config/store');
const { isDbConnected } = require('../config/db');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    if (isDbConnected()) {
      const categories = await Category.find({}).sort({ createdAt: 1 });
      return res.json(categories);
    }
    res.json(inMemoryCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, image, iconName, color } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (isDbConnected()) {
      const exists = await Category.findOne({ name });
      if (exists) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }

      const category = await Category.create({
        name,
        slug,
        description: description || '',
        image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        iconName: iconName || 'ShoppingBag',
        color: color || 'orange',
        productCount: 0,
        isActive: true,
      });
      return res.status(201).json(category);
    }

    const existsMem = inMemoryCategories.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (existsMem) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const newCategory = {
      _id: `cat_mem_${Date.now()}`,
      name,
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      iconName: iconName || 'ShoppingBag',
      color: color || 'orange',
      productCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    inMemoryCategories.push(newCategory);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, image, iconName, color, isActive } = req.body;
    const { id } = req.params;

    if (isDbConnected()) {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      if (name) {
        category.name = name;
        category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (description !== undefined) category.description = description;
      if (image !== undefined) category.image = image;
      if (iconName !== undefined) category.iconName = iconName;
      if (color !== undefined) category.color = color;
      if (isActive !== undefined) category.isActive = isActive;

      const updated = await category.save();
      return res.json(updated);
    }

    const catIndex = inMemoryCategories.findIndex((c) => c._id === id);
    if (catIndex === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const current = inMemoryCategories[catIndex];
    const updated = {
      ...current,
      name: name || current.name,
      slug: name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : current.slug,
      description: description !== undefined ? description : current.description,
      image: image !== undefined ? image : current.image,
      iconName: iconName !== undefined ? iconName : current.iconName,
      color: color !== undefined ? color : current.color,
      isActive: isActive !== undefined ? isActive : current.isActive,
    };

    inMemoryCategories[catIndex] = updated;
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      await category.deleteOne();
      return res.json({ message: 'Category deleted successfully' });
    }

    const catIndex = inMemoryCategories.findIndex((c) => c._id === id);
    if (catIndex === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }

    inMemoryCategories.splice(catIndex, 1);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
