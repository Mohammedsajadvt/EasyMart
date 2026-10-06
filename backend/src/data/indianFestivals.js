const indianFestivalsData = [
  {
    name: 'Navratri & Durga Puja Utsav Bonanza',
    festival: 'Navratri & Durga Puja',
    emoji: '🌸',
    dateDisplay: 'October 01 - October 19, 2026',
    month: 'October',
    startMonth: 10,
    startDay: 1,
    endMonth: 10,
    endDay: 19,
    discountPercentage: 25,
    couponCode: 'NAVRATRI25',
    headline: '🌸 Navratri & Durga Puja Grand Utsav: Flat 25% OFF Festive Deals!',
    subtext: 'Special 9-day grand celebrations with exclusive discounts across ethnic wear, electronics, home decor & audio gear.',
    themeGradient: 'linear-gradient(135deg, #831843 0%, #C026D3 50%, #9333EA 100%)',
    badgeText: 'NAVRATRI UTSAV LIVE',
    appliedCategory: 'All',
    isActive: true,
    isAutoCalendar: true,
  },
  {
    name: 'Dussehra / Vijayadashami Mega Victory Sale',
    festival: 'Dussehra (Vijayadashami)',
    emoji: '🏹',
    dateDisplay: 'October 20 - October 25, 2026',
    month: 'October',
    startMonth: 10,
    startDay: 20,
    endMonth: 10,
    endDay: 25,
    discountPercentage: 25,
    couponCode: 'VIJAY25',
    headline: '🏹 Victory Season Mega Offers: Extra 25% OFF On Top Brands!',
    subtext: 'Special Vijayadashami savings on flagship Sony, Apple, Samsung electronics and luxury wearables.',
    themeGradient: 'linear-gradient(135deg, #1E1B4B 0%, #4338CA 60%, #6366F1 100%)',
    badgeText: 'DUSSEHRA SPECIAL',
    appliedCategory: 'All',
    isActive: false,
    isAutoCalendar: true,
  },
  {
    name: 'Diwali Grand Dhamaka Festival Sale',
    festival: 'Diwali (Deepavali)',
    emoji: '🪔',
    dateDisplay: 'October 26 - November 05, 2026',
    month: 'October / November',
    startMonth: 10,
    startDay: 26,
    endMonth: 11,
    endDay: 5,
    discountPercentage: 30,
    couponCode: 'DIWALI30',
    headline: '🪔 Diwali Mahotsav Mega Sale: Up to 30% OFF Everything!',
    subtext: 'Light up your home with premium electronics, festive fashion, smart tech & home appliances with instant bank discounts!',
    themeGradient: 'linear-gradient(135deg, #78350F 0%, #B45309 40%, #EA580C 100%)',
    badgeText: 'DIWALI DHAMAKA LIVE',
    appliedCategory: 'All',
    isActive: false,
    isAutoCalendar: true,
  },
  {
    name: 'Christmas & New Year Mega Celebration',
    festival: 'Christmas & New Year',
    emoji: '🎄',
    dateDisplay: 'December 15, 2026 - January 05, 2027',
    month: 'December / January',
    startMonth: 12,
    startDay: 15,
    endMonth: 1,
    endDay: 5,
    discountPercentage: 30,
    couponCode: 'HOLIDAY30',
    headline: '🎄 Year-End Carnival & Winter Fest: Up to 30% Holiday Discount!',
    subtext: 'Ring in the New Year with huge discounts on gaming, laptops, audio, winter fashion and lifestyle.',
    themeGradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #DC2626 100%)',
    badgeText: 'YEAR-END BONANZA',
    appliedCategory: 'All',
    isActive: false,
    isAutoCalendar: true,
  },
  {
    name: 'Pongal & Makar Sankranti Harvest Bonanza',
    festival: 'Pongal / Makar Sankranti',
    emoji: '🪁',
    dateDisplay: 'January 10 - January 18, 2026',
    month: 'January',
    startMonth: 1,
    startDay: 10,
    endMonth: 1,
    endDay: 18,
    discountPercentage: 20,
    couponCode: 'SANKRANTI20',
    headline: '🪁 Harvest New Beginnings with Mega Gadget & Lifestyle Discounts!',
    subtext: 'Kickstart the new year season with premier smart gadgets, 4K TVs, and home appliances.',
    themeGradient: 'linear-gradient(135deg, #0C4A6E 0%, #0284C7 50%, #38BDF8 100%)',
    badgeText: 'HARVEST BONANZA',
    appliedCategory: 'All',
    isActive: false,
    isAutoCalendar: true,
  },
  {
    name: 'Republic Day Super Saver Event',
    festival: 'Republic Day Sale',
    emoji: '🇮🇳',
    dateDisplay: 'January 19 - January 28, 2026',
    month: 'January',
    startMonth: 1,
    startDay: 19,
    endMonth: 1,
    endDay: 28,
    discountPercentage: 25,
    couponCode: 'REPUBLIC25',
    headline: '🇮🇳 Republic Day Mega Electronics & Home Super Saver Days!',
    subtext: 'Massive exchange bonuses, no-cost EMIs, and flat 25% instant discount coupons.',
    themeGradient: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #EA580C 100%)',
    badgeText: 'REPUBLIC DAY SALE',
    appliedCategory: 'All',
    isActive: false,
    isAutoCalendar: true,
  },
  {
    name: 'Holi Colors & Electronics Splash',
    festival: 'Holi (Festival of Colors)',
    emoji: '🎨',
    dateDisplay: 'March 10 - March 18, 2026',
    month: 'March',
    startMonth: 3,
    startDay: 10,
    endMonth: 3,
    endDay: 18,
    discountPercentage: 25,
    couponCode: 'HOLI25',
    headline: '🎨 Rang Barse Mega Festival: Flat 25% Splash Discount!',
    subtext: 'Celebrate vibrant festivities with waterproof gadgets, trendy wearables, audio gear and festive fashion drops.',
    themeGradient: 'linear-gradient(135deg, #831843 0%, #BE185D 40%, #DB2777 100%)',
    badgeText: 'HOLI SPECIAL DEALS',
    appliedCategory: 'All',
    isActive: false,
    isAutoCalendar: true,
  },
  {
    name: 'Eid Mubarak Grand Festive Celebration',
    festival: 'Eid-ul-Fitr & Eid-al-Adha',
    emoji: '🌙',
    dateDisplay: 'March 19 - March 28, 2026',
    month: 'March',
    startMonth: 3,
    startDay: 19,
    endMonth: 3,
    endDay: 28,
    discountPercentage: 25,
    couponCode: 'EIDMUBARAK',
    headline: '🌙 Eid Mubarak Super Festive Savings: Flat 25% OFF!',
    subtext: 'Celebrate joy with premium gifts, designer accessories, premium audio & exclusive home appliances.',
    themeGradient: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #10B981 100%)',
    badgeText: 'EID FESTIVE DROP',
    appliedCategory: 'All',
    isActive: false,
    isAutoCalendar: true,
  },
  {
    name: 'Independence Day Freedom Festival',
    festival: 'Indian Independence Day',
    emoji: '🇮🇳',
    dateDisplay: 'August 08 - August 18, 2026',
    month: 'August',
    startMonth: 8,
    startDay: 8,
    endMonth: 8,
    endDay: 18,
    discountPercentage: 30,
    couponCode: 'FREEDOM30',
    headline: '🇮🇳 Great Freedom Sale: Massive Price Cuts on 10,000+ Products!',
    subtext: 'Unbelievable freedom discounts across top electronic brands, mobile phones, and lifestyle essentials.',
    themeGradient: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 40%, #15803D 100%)',
    badgeText: 'FREEDOM SALE',
    appliedCategory: 'All',
    isActive: false,
    isAutoCalendar: true,
  },
  {
    name: 'Raksha Bandhan Sibling Special Drop',
    festival: 'Raksha Bandhan',
    emoji: '🎁',
    dateDisplay: 'August 19 - August 28, 2026',
    month: 'August',
    startMonth: 8,
    startDay: 19,
    endMonth: 8,
    endDay: 28,
    discountPercentage: 20,
    couponCode: 'RAKHI20',
    headline: '🎁 Celebrate Sibling Love with Perfect Tech & Luxury Gifts!',
    subtext: 'Find the ultimate gifts for your brother & sister: smartwatches, audio accessories, luxury perfumes & eyewear.',
    themeGradient: 'linear-gradient(135deg, #881337 0%, #BE123C 50%, #F43F5E 100%)',
    badgeText: 'RAKHI GIFT FEST',
    appliedCategory: 'All',
    isActive: false,
    isAutoCalendar: true,
  },
  {
    name: 'Onam Carnival & Grand Harvest Sale',
    festival: 'Onam (Kerala Harvest Festival)',
    emoji: '🌼',
    dateDisplay: 'August 29 - September 08, 2026',
    month: 'August / September',
    startMonth: 8,
    startDay: 29,
    endMonth: 9,
    endDay: 8,
    discountPercentage: 20,
    couponCode: 'ONAM20',
    headline: '🌼 Grand Onam Mahotsavam: Festive Offers for the Entire Family!',
    subtext: 'Special Kerala harvest celebration discounts on home appliances, kitchen gadgets, and electronics.',
    themeGradient: 'linear-gradient(135deg, #713F12 0%, #CA8A04 60%, #EAB308 100%)',
    badgeText: 'ONAM CARNIVAL',
    appliedCategory: 'All',
    isActive: false,
    isAutoCalendar: true,
  },
];

/**
 * Automatically resolves the festival corresponding to the given date (or current date right now)
 */
function getFestivalForDate(date = new Date(), festivals = indianFestivalsData) {
  const d = new Date(date);
  const curMonth = d.getMonth() + 1; // 1-12
  const curDay = d.getDate(); // 1-31
  const curYear = d.getFullYear();

  // Convert month + day into comparable day of year (approx) or month*100 + day
  const toScore = (m, day) => m * 100 + day;
  const currentScore = toScore(curMonth, curDay);

  // 1. Check for exact active festival within date range
  for (const fest of festivals) {
    if (!fest.startMonth || !fest.endMonth) continue;

    const startScore = toScore(fest.startMonth, fest.startDay || 1);
    const endScore = toScore(fest.endMonth, fest.endDay || 31);

    // Handle year rollover (e.g. Dec to Jan)
    if (startScore > endScore) {
      if (currentScore >= startScore || currentScore <= endScore) {
        return {
          ...fest,
          isLiveNow: true,
          resolvedDate: d.toISOString(),
          calendarStatus: 'live',
        };
      }
    } else {
      if (currentScore >= startScore && currentScore <= endScore) {
        return {
          ...fest,
          isLiveNow: true,
          resolvedDate: d.toISOString(),
          calendarStatus: 'live',
        };
      }
    }
  }

  // 2. If no festival is active today, find the upcoming festival
  let closestUpcoming = null;
  let minDiff = Infinity;

  for (const fest of festivals) {
    if (!fest.startMonth) continue;
    let startScore = toScore(fest.startMonth, fest.startDay || 1);
    let diff = startScore - currentScore;
    if (diff < 0) diff += 1200; // wrap around next year

    if (diff < minDiff) {
      minDiff = diff;
      closestUpcoming = fest;
    }
  }

  return {
    ...(closestUpcoming || festivals[0]),
    isLiveNow: false,
    resolvedDate: d.toISOString(),
    calendarStatus: 'upcoming',
  };
}

module.exports = indianFestivalsData;
module.exports.getFestivalForDate = getFestivalForDate;
