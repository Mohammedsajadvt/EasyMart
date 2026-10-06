const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const FestivalCampaign = require('../models/FestivalCampaign');
const productsData = require('../data/products');
const categoriesData = require('../data/categories');
const indianFestivalsData = require('../data/indianFestivals');
const { inMemoryProducts, inMemoryCategories, inMemoryFestivals, inMemoryUsers } = require('../config/store');
const { isDbConnected } = require('../config/db');

router.post('/seed', async (req, res) => {
  try {
    if (isDbConnected()) {
      await Product.deleteMany({});
      const insertedProducts = await Product.insertMany(productsData);

      await Category.deleteMany({});
      const insertedCategories = await Category.insertMany(categoriesData);

      await FestivalCampaign.deleteMany({});
      const insertedFestivals = await FestivalCampaign.insertMany(indianFestivalsData);

      // Create Admin users
      const usersToCreate = [
        {
          name: 'Mohammed Sajad',
          email: 'mohammedsajadvt@gmail.com',
          password: 'password123',
          role: 'admin',
        },
        {
          name: 'EasyMart Administrator',
          email: 'admin@easymart.com',
          password: 'password123',
          role: 'admin',
        },
        {
          name: 'Alex Johnson',
          email: 'customer@easymart.com',
          password: 'password123',
          role: 'user',
          phone: '+1 (555) 234-5678',
          address: {
            street: '742 Evergreen Terrace',
            city: 'Springfield',
            state: 'OR',
            postalCode: '97477',
            country: 'United States',
          },
        },
      ];

      for (const u of usersToCreate) {
        const exists = await User.findOne({ email: u.email });
        if (!exists) {
          await User.create(u);
        }
      }

      return res.json({
        message: 'MongoDB Atlas successfully seeded with products, categories, Indian festivals, and users!',
        productsCount: insertedProducts.length,
        categoriesCount: insertedCategories.length,
        festivalsCount: insertedFestivals.length,
        accounts: {
          admin: 'mohammedsajadvt@gmail.com / password123',
          customer: 'customer@easymart.com / password123',
        },
      });
    }

    // In memory seeding
    res.json({
      message: 'Datastore refreshed with products, categories, Indian festival offers, and users!',
      productsCount: inMemoryProducts.length,
      categoriesCount: inMemoryCategories.length,
      festivalsCount: inMemoryFestivals.length,
      accounts: {
        admin: 'mohammedsajadvt@gmail.com / password123',
        customer: 'customer@easymart.com / password123',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
