export const packages = [
  { id: 'wash', en: { name: 'Signature Wash', items: ['Hand wash & dry', 'Wheel deep clean', 'Interior vacuum', 'Tyre dressing'] }, ar: { name: 'غسيل مميز', items: ['غسيل يدوي وتجفيف', 'تنظيف عميق للإطارات', 'شفط داخلي', 'تلميع الإطارات'] }, price: 12.5, hours: 1.5 },
  { id: 'ceramic', en: { name: 'Ceramic Coating', items: ['2-stage paint correction', '9H ceramic, 3 years', 'Glass & wheels coated', 'Aftercare kit'] }, ar: { name: 'حماية سيراميك', items: ['تصحيح طلاء بمرحلتين', 'سيراميك 9H لثلاث سنوات', 'حماية الزجاج والإطارات', 'عدة عناية'] }, price: 185, hours: 48, featured: true },
  { id: 'ppf', en: { name: 'Front PPF', items: ['Bumper, hood, mirrors', 'Self-healing film', 'Invisible edges', '5-year warranty'] }, ar: { name: 'فيلم حماية أمامي', items: ['الصدام والغطاء والمرايا', 'فيلم ذاتي الإصلاح', 'حواف غير مرئية', 'ضمان 5 سنوات'] }, price: 390, hours: 72 },
] as const

export const faqs = [
  { en: ['How long does ceramic take?', 'Two days. We correct the paint first, then cure the coating under infrared lamps.'], ar: ['كم يستغرق السيراميك؟', 'يومان. نصحّح الطلاء أولًا ثم نعالج الطبقة تحت مصابيح الأشعة تحت الحمراء.'] },
  { en: ['Do you pick up the car?', 'Yes, within Kuwait City and Hawalli for detailing packages.'], ar: ['هل تستلمون السيارة؟', 'نعم، ضمن مدينة الكويت وحولي لباقات التلميع.'] },
  { en: ['Ramadan hours?', 'We open after Iftar until 2 am. Slots fill fast; book ahead.'], ar: ['أوقات رمضان؟', 'نعمل بعد الإفطار حتى الثانية صباحًا. المواعيد تمتلئ بسرعة، فاحجز مبكرًا.'] },
]
