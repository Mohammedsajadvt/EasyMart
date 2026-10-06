const FestivalCampaign = require('../models/FestivalCampaign');
const Product = require('../models/Product');
const { inMemoryFestivals, inMemoryProducts } = require('../config/store');
const { isDbConnected } = require('../config/db');
const indianFestivalsData = require('../data/indianFestivals');
const { getFestivalForDate } = require('../data/indianFestivals');

// @desc    Get all festival campaigns
// @route   GET /api/festivals
// @access  Public
const getFestivals = async (req, res) => {
  try {
    const today = new Date(req.query.date || Date.now());
    const resolvedToday = getFestivalForDate(today, indianFestivalsData);

    if (isDbConnected()) {
      let festivals = await FestivalCampaign.find({}).sort({ createdAt: 1 });
      // If DB empty, seed with indian festivals
      if (!festivals || festivals.length === 0) {
        festivals = await FestivalCampaign.insertMany(indianFestivalsData);
      }
      return res.json({
        festivals,
        currentDate: today.toISOString(),
        todayFestival: resolvedToday,
      });
    }

    res.json({
      festivals: inMemoryFestivals,
      currentDate: today.toISOString(),
      todayFestival: resolvedToday,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get festival dynamically based on current date / calendar
// @route   GET /api/festivals/current-date
// @access  Public
const getCurrentDateFestival = async (req, res) => {
  try {
    const targetDate = req.query.date ? new Date(req.query.date) : new Date();
    const festivalToday = getFestivalForDate(targetDate, indianFestivalsData);

    res.json({
      success: true,
      currentDate: targetDate.toISOString(),
      formattedDate: targetDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      festival: festivalToday,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active festival campaign (resolves real-time calendar date or admin active)
// @route   GET /api/festivals/active
// @access  Public
const getActiveFestival = async (req, res) => {
  try {
    const today = req.query.date ? new Date(req.query.date) : new Date();
    const liveByCalendar = getFestivalForDate(today, indianFestivalsData);

    if (isDbConnected()) {
      const activeFromDb = await FestivalCampaign.findOne({ isActive: true });
      if (activeFromDb) {
        return res.json({
          ...activeFromDb.toObject(),
          currentDate: today.toISOString(),
          calendarLiveFestival: liveByCalendar.festival,
        });
      }
      return res.json({
        ...liveByCalendar,
        isActive: true,
        currentDate: today.toISOString(),
      });
    }

    const activeMem = inMemoryFestivals.find((f) => f.isActive);
    if (activeMem) {
      return res.json({
        ...activeMem,
        currentDate: today.toISOString(),
        calendarLiveFestival: liveByCalendar.festival,
      });
    }

    res.json({
      ...liveByCalendar,
      isActive: true,
      currentDate: today.toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auto-detect & activate today's festival based on calendar date
// @route   POST /api/festivals/auto-detect-today
// @access  Private/Admin
const autoDetectTodayFestival = async (req, res) => {
  try {
    const targetDate = req.body.date ? new Date(req.body.date) : new Date();
    const detected = getFestivalForDate(targetDate, indianFestivalsData);

    if (isDbConnected()) {
      await FestivalCampaign.updateMany({}, { isActive: false });
      let campaign = await FestivalCampaign.findOne({ festival: detected.festival });
      if (!campaign) {
        campaign = await FestivalCampaign.create({
          ...detected,
          isActive: true,
        });
      } else {
        campaign.isActive = true;
        await campaign.save();
      }

      return res.json({
        message: `Auto-detected and activated: ${campaign.name} for ${targetDate.toDateString()}!`,
        campaign,
        currentDate: targetDate.toISOString(),
      });
    }

    inMemoryFestivals.forEach((f) => {
      f.isActive = f.festival === detected.festival;
    });

    const active = inMemoryFestivals.find((f) => f.isActive) || detected;

    res.json({
      message: `Auto-detected and activated: ${active.name} for ${targetDate.toDateString()}!`,
      campaign: active,
      currentDate: targetDate.toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle / Activate festival campaign
// @route   PUT /api/festivals/:id/toggle
// @access  Private/Admin
const toggleFestival = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const target = await FestivalCampaign.findById(id);
      if (!target) {
        return res.status(404).json({ message: 'Festival campaign not found' });
      }

      const nextStatus = !target.isActive;

      // If activating, deactivate others to ensure clean active banner
      if (nextStatus) {
        await FestivalCampaign.updateMany({}, { isActive: false });
      }

      target.isActive = nextStatus;
      await target.save();
      return res.json({ message: `Festival campaign ${nextStatus ? 'Activated' : 'Deactivated'}`, campaign: target });
    }

    const festIndex = inMemoryFestivals.findIndex((f) => f._id === id);
    if (festIndex === -1) {
      return res.status(404).json({ message: 'Festival campaign not found' });
    }

    const nextStatus = !inMemoryFestivals[festIndex].isActive;
    if (nextStatus) {
      inMemoryFestivals.forEach((f) => (f.isActive = false));
    }
    inMemoryFestivals[festIndex].isActive = nextStatus;

    res.json({
      message: `Festival campaign ${nextStatus ? 'Activated' : 'Deactivated'}`,
      campaign: inMemoryFestivals[festIndex],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply festival discount to catalog products ("Move to Offer")
// @route   POST /api/festivals/:id/apply-offers
// @access  Private/Admin
const applyFestivalOfferToProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, discountPercentage, applyToAll } = req.body;

    let campaign = null;
    if (isDbConnected()) {
      campaign = await FestivalCampaign.findById(id);
    } else {
      campaign = inMemoryFestivals.find((f) => f._id === id);
    }

    const discount = discountPercentage || (campaign ? campaign.discountPercentage : 25);
    const filterCat = category || (campaign ? campaign.appliedCategory : 'All');

    if (isDbConnected()) {
      const query = filterCat !== 'All' ? { category: filterCat } : {};
      const products = await Product.find(query);

      for (let prod of products) {
        prod.isFlashDeal = true;
        prod.discountPercentage = discount;
        prod.originalPrice = Math.round(prod.price * (100 / (100 - discount)));
        if (!prod.tags) prod.tags = [];
        if (!prod.tags.includes('festival-offer')) {
          prod.tags.push('festival-offer');
        }
        await prod.save();
      }

      return res.json({
        message: `Successfully moved ${products.length} products to ${campaign?.name || 'Festival'} Offer (${discount}% OFF)!`,
        updatedCount: products.length,
      });
    }

    let updatedCount = 0;
    inMemoryProducts.forEach((prod) => {
      if (filterCat === 'All' || prod.category === filterCat) {
        prod.isFlashDeal = true;
        prod.discountPercentage = discount;
        prod.originalPrice = Math.round(prod.price * (100 / (100 - discount)));
        if (!prod.tags) prod.tags = [];
        if (!prod.tags.includes('festival-offer')) {
          prod.tags.push('festival-offer');
        }
        updatedCount++;
      }
    });

    res.json({
      message: `Successfully moved ${updatedCount} products to ${campaign?.name || 'Festival'} Offer (${discount}% OFF)!`,
      updatedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auto fetch / sync Indian Calendar Festivals
// @route   POST /api/festivals/sync-calendar
// @access  Private/Admin
const syncIndianCalendar = async (req, res) => {
  try {
    if (isDbConnected()) {
      for (const fest of indianFestivalsData) {
        const exists = await FestivalCampaign.findOne({ festival: fest.festival });
        if (!exists) {
          await FestivalCampaign.create(fest);
        } else {
          Object.assign(exists, fest);
          await exists.save();
        }
      }
      const all = await FestivalCampaign.find({});
      return res.json({ message: 'Indian Festival Calendar synced successfully!', count: all.length, festivals: all });
    }

    // in-memory refresh
    indianFestivalsData.forEach((fest, idx) => {
      const exists = inMemoryFestivals.find((f) => f.festival === fest.festival);
      if (!exists) {
        inMemoryFestivals.push({
          ...fest,
          _id: `fest_mem_${Date.now()}_${idx}`,
          createdAt: new Date().toISOString(),
        });
      } else {
        Object.assign(exists, fest);
      }
    });

    res.json({
      message: 'Indian Festival Calendar synced successfully!',
      count: inMemoryFestivals.length,
      festivals: inMemoryFestivals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create custom festival campaign
// @route   POST /api/festivals
// @access  Private/Admin
const createFestival = async (req, res) => {
  try {
    const {
      name,
      festival,
      emoji,
      dateDisplay,
      month,
      discountPercentage,
      couponCode,
      headline,
      subtext,
      themeGradient,
      badgeText,
      appliedCategory,
    } = req.body;

    if (!name || !festival || !couponCode) {
      return res.status(400).json({ message: 'Campaign name, festival and coupon code are required' });
    }

    const campaignData = {
      name,
      festival,
      emoji: emoji || '🎉',
      dateDisplay: dateDisplay || 'Festive Season 2026',
      month: month || 'Current',
      discountPercentage: Number(discountPercentage) || 20,
      couponCode: couponCode.toUpperCase(),
      headline: headline || `${emoji || '🎉'} ${name}: Special Festive Discounts!`,
      subtext: subtext || 'Exclusive seasonal offers across all superstore products.',
      themeGradient: themeGradient || 'linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)',
      badgeText: badgeText || 'LIMITED FESTIVAL DEAL',
      appliedCategory: appliedCategory || 'All',
      isActive: false,
      isAutoCalendar: false,
    };

    if (isDbConnected()) {
      const campaign = await FestivalCampaign.create(campaignData);
      return res.status(201).json(campaign);
    }

    const newCampaign = {
      ...campaignData,
      _id: `fest_mem_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    inMemoryFestivals.push(newCampaign);
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFestivals,
  getActiveFestival,
  getCurrentDateFestival,
  autoDetectTodayFestival,
  toggleFestival,
  applyFestivalOfferToProducts,
  syncIndianCalendar,
  createFestival,
};
