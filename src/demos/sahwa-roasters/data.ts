export type MenuItem = { id: string; en: string; ar: string; note_en?: string; note_ar?: string; sizes: { en: string; ar: string; price: number }[]; tags?: ('milk' | 'nuts' | 'vegan')[] }
export type MenuCategory = { id: string; en: string; ar: string; items: MenuItem[] }

export const branches = [
  { id: 'salmiya', en: 'Salmiya · Salem Al Mubarak St', ar: 'السالمية · شارع سالم المبارك', hours: '7:00 – 23:00' },
  { id: 'city', en: 'Kuwait City · Al Hamra', ar: 'مدينة الكويت · الحمراء', hours: '6:30 – 22:00' },
]

export const roasts = [
  { en: 'Light', ar: 'خفيف', color: '#c99a6b', note_en: 'Floral, citrus', note_ar: 'زهري، حمضي' },
  { en: 'Medium', ar: 'متوسط', color: '#8a5a3a', note_en: 'Caramel, cocoa', note_ar: 'كراميل، كاكاو' },
  { en: 'Dark', ar: 'غامق', color: '#3b2418', note_en: 'Smoky, bold', note_ar: 'مدخّن، قوي' },
]

export const menu: MenuCategory[] = [
  { id: 'espresso', en: 'Espresso bar', ar: 'إسبريسو', items: [
    { id: 'espresso', en: 'Espresso', ar: 'إسبريسو', sizes: [{ en: 'Single', ar: 'فردي', price: 1.25 }, { en: 'Double', ar: 'مزدوج', price: 1.5 }] },
    { id: 'flat-white', en: 'Flat white', ar: 'فلات وايت', note_en: 'Ethiopia Guji, medium roast', note_ar: 'إثيوبيا غوجي، تحميص متوسط', sizes: [{ en: 'Regular', ar: 'عادي', price: 1.9 }], tags: ['milk'] },
    { id: 'spanish', en: 'Spanish latte', ar: 'سبانيش لاتيه', sizes: [{ en: 'Regular', ar: 'عادي', price: 2.1 }, { en: 'Large', ar: 'كبير', price: 2.4 }], tags: ['milk'] },
  ] },
  { id: 'filter', en: 'Filter & cold', ar: 'فلتر وبارد', items: [
    { id: 'v60', en: 'V60 pour-over', ar: 'V60', note_en: 'Choose today’s single origin', note_ar: 'اختر أصل اليوم', sizes: [{ en: 'Cup', ar: 'كوب', price: 2.25 }] },
    { id: 'cold-brew', en: 'Cold brew', ar: 'كولد برو', sizes: [{ en: 'Regular', ar: 'عادي', price: 1.95 }, { en: 'Bottle 500ml', ar: 'زجاجة 500 مل', price: 3.5 }], tags: ['vegan'] },
    { id: 'iced-oat', en: 'Iced oat latte', ar: 'لاتيه شوفان مثلج', sizes: [{ en: 'Regular', ar: 'عادي', price: 2.3 }], tags: ['vegan'] },
  ] },
  { id: 'beans', en: 'Beans to take home', ar: 'حبوب للمنزل', items: [
    { id: 'guji', en: 'Ethiopia Guji', ar: 'إثيوبيا غوجي', note_en: 'Washed · light', note_ar: 'مغسول · خفيف', sizes: [{ en: '250 g', ar: '250 غ', price: 5.5 }, { en: '1 kg', ar: '1 كغ', price: 19 }] },
    { id: 'huila', en: 'Colombia Huila', ar: 'كولومبيا هويلا', note_en: 'Natural · medium', note_ar: 'طبيعي · متوسط', sizes: [{ en: '250 g', ar: '250 غ', price: 5.25 }, { en: '1 kg', ar: '1 كغ', price: 18 }] },
  ] },
  { id: 'bakery', en: 'Bakery', ar: 'مخبوزات', items: [
    { id: 'croissant', en: 'Butter croissant', ar: 'كرواسان زبدة', sizes: [{ en: 'Piece', ar: 'قطعة', price: 1.1 }], tags: ['milk'] },
    { id: 'pistachio', en: 'Pistachio cookie', ar: 'كوكيز فستق', sizes: [{ en: 'Piece', ar: 'قطعة', price: 1.35 }], tags: ['nuts', 'milk'] },
  ] },
]
