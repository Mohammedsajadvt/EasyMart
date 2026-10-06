const mongoose = require('mongoose');

const festivalCampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    festival: {
      type: String,
      required: true,
      trim: true,
    },
    emoji: {
      type: String,
      default: '🪔',
    },
    dateDisplay: {
      type: String,
      required: true,
      default: 'Oct - Nov 2026',
    },
    month: {
      type: String,
      default: 'October',
    },
    startMonth: {
      type: Number,
      default: 10,
    },
    startDay: {
      type: Number,
      default: 1,
    },
    endMonth: {
      type: Number,
      default: 10,
    },
    endDay: {
      type: Number,
      default: 31,
    },
    discountPercentage: {
      type: Number,
      default: 25,
      min: 5,
      max: 80,
    },
    couponCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    headline: {
      type: String,
      required: true,
    },
    subtext: {
      type: String,
      default: '',
    },
    themeGradient: {
      type: String,
      default: 'linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)',
    },
    badgeText: {
      type: String,
      default: 'FESTIVAL SPECIAL OFFER',
    },
    appliedCategory: {
      type: String,
      default: 'All',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isAutoCalendar: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const FestivalCampaign = mongoose.model('FestivalCampaign', festivalCampaignSchema);
module.exports = FestivalCampaign;
