const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: function () {
        return this.price;
      },
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    brand: {
      type: String,
      default: 'EasyMart Select',
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    coverImage: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 10,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isFlashDeal: {
      type: Boolean,
      default: false,
    },
    dealEndTime: {
      type: Date,
    },
    tags: [String],
    attributes: [
      {
        name: String,
        value: String,
      },
    ],
  },
  { timestamps: true }
);

// Auto slug and discount calculation
productSchema.pre('save', function () {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
