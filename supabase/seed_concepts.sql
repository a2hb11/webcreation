-- Concept projects (fictional brands) that fill the showcase until client
-- work exists. Covers are committed under public/demos/<slug>/. Idempotent.
begin;

create temporary table seed_projects (
  slug text, category_slug text, tier public.tier, title_en text, title_ar text,
  summary_en text, summary_ar text, body_en text, body_ar text, cover_path text, accent_color text,
  demo_route text, price_from numeric, price_to numeric, duration_days int, features jsonb, tech_stack text[], featured boolean, sort_order int
);

insert into seed_projects values
('barq-detailing', 'landing-pages', 'starter', 'Barq Detailing', 'برق لتلميع السيارات',
 'One dark landing page that turns Instagram traffic into WhatsApp bookings for a ceramic-coating shop.',
 'صفحة هبوط واحدة تحوّل زوار إنستغرام إلى حجوزات واتساب لمحل حماية سيراميك.',
 'Brief: a detailing shop in Shuwaikh Industrial gets most of its customers from Instagram and loses them in slow DMs about prices and slots.

Solution: a single page with a gloss comparison slider, three packages priced in KWD, a next-available-slot strip, an FAQ and a WhatsApp button that opens a chat with the chosen package already written.

Result: one page, one data file, under 200 KB, scoped to ship in a week. Fictional brand, no client figures.',
 'الفكرة: محل تلميع في الشويخ الصناعية يحصل على معظم عملائه من إنستغرام ويخسرهم في رسائل بطيئة عن الأسعار والمواعيد.

الحل: صفحة واحدة بمقارنة لمعان تفاعلية وثلاث باقات بالدينار وشريط لأقرب موعد وأسئلة شائعة وزر واتساب يفتح محادثة والباقة المختارة مكتوبة مسبقًا.

النتيجة: صفحة واحدة وملف بيانات واحد وأقل من 200 كيلوبايت، قابلة للتسليم خلال أسبوع. علامة خيالية بلا أرقام عملاء.',
 '/demos/barq-detailing/cover-en.jpg', '#22D3EE', '/demo/barq-detailing', 150, 200, 7,
 '[{"en":"Before/after gloss slider","ar":"مقارنة لمعان قبل/بعد"},{"en":"Three packages with KWD prices","ar":"ثلاث باقات بأسعار بالدينار"},{"en":"Next-available-slot strip","ar":"شريط أقرب موعد"},{"en":"Prefilled WhatsApp booking","ar":"حجز واتساب برسالة جاهزة"},{"en":"Sticky mobile call to action","ar":"زر ثابت على الجوال"}]',
 array['Next.js','Tailwind','Motion'], true, 10),
('sahwa-roasters', 'restaurants', 'starter', 'Sahwa Roasters', 'محمصة صحوة',
 'A bilingual QR menu with categories, sizes and KWD prices, and a cart that composes a WhatsApp order.',
 'قائمة QR ثنائية اللغة بفئات وأحجام وأسعار بالدينار، وسلة تُنشئ طلب واتساب.',
 'Brief: a specialty roastery with two branches wants a QR menu that reads perfectly in Arabic and English and lets guests order on WhatsApp without an app.

Solution: a story page with roast levels and branch hours, plus a menu page with sticky category tabs, search, allergen tags, three-decimal KWD prices and a cart that composes the order message with the chosen branch.

Result: menu changes come from one data file; the Professional tier adds an admin panel so staff edit it themselves.',
 'الفكرة: محمصة مختصة بفرعين تريد قائمة QR تُقرأ بشكل مثالي بالعربية والإنجليزية وتتيح الطلب عبر واتساب دون تطبيق.

الحل: صفحة قصة بمستويات التحميص وساعات الفروع، وصفحة قائمة بتبويبات ثابتة وبحث ووسوم للمكونات وأسعار بالدينار وسلة تُنشئ رسالة الطلب مع الفرع المختار.

النتيجة: تحديث القائمة من ملف واحد، وتضيف الباقة الاحترافية لوحة تحكم ليعدّلها الموظفون بأنفسهم.',
 '/demos/sahwa-roasters/cover-en.jpg', '#C8552A', '/demo/sahwa-roasters', 220, 300, 12,
 '[{"en":"Bilingual QR menu","ar":"قائمة QR ثنائية اللغة"},{"en":"Category tabs and search","ar":"تبويبات وبحث"},{"en":"Sizes, allergens, KWD prices","ar":"أحجام ومكونات وأسعار بالدينار"},{"en":"WhatsApp order cart per branch","ar":"سلة طلب واتساب لكل فرع"},{"en":"Branch hours","ar":"ساعات الفروع"}]',
 array['Next.js','Tailwind','WhatsApp'], true, 20),
('bayt-misk', 'online-stores', 'elite', 'Bayt Misk', 'بيت مسك',
 'A dark perfume storefront with note-based filtering, wishlists, a cart and a simulated KNET / Apple Pay checkout.',
 'متجر عطور داكن بتصفية حسب الروائح وقوائم أمنيات وسلة ودفع محاكى عبر كي-نت وApple Pay.',
 'Brief: a Kuwaiti perfume house wants an online store that feels like its boutique, accepts KNET and Apple Pay and rewards repeat buyers.

Solution: a four-page store: collections, a shop grid with note-family filters and sorting, product pages with a notes pyramid, sizes, wishlist and pre-order badges, and a checkout with Kuwait address fields, delivery slots and a simulated hosted-payment step that awards loyalty points.

Result: a complete storefront flow built with zero product photography (SVG bottles), wired in production to a real gateway, customer accounts and the admin panel.',
 'الفكرة: دار عطور كويتية تريد متجرًا إلكترونيًا يشبه بوتيكها ويقبل كي-نت وApple Pay ويكافئ العملاء المتكررين.

الحل: متجر من أربع صفحات: المجموعات، وشبكة منتجات بتصفية حسب عائلة الرائحة وترتيب، وصفحات منتج بهرم الروائح والأحجام وقائمة الأمنيات وشارة الطلب المسبق، وإتمام شراء بحقول العنوان الكويتي وأوقات التوصيل وخطوة دفع محاكاة تمنح نقاط ولاء.

النتيجة: تدفق متجر كامل بلا تصوير منتجات (زجاجات SVG)، يُربط في الإنتاج ببوابة دفع حقيقية وحسابات عملاء ولوحة التحكم.',
 '/demos/bayt-misk/cover-en.jpg', '#B8863B', '/demo/bayt-misk', 950, 1200, 60,
 '[{"en":"Filter by note family and price","ar":"تصفية حسب الرائحة والسعر"},{"en":"Product pages with notes pyramid","ar":"صفحات منتج بهرم الروائح"},{"en":"Cart drawer, wishlist, pre-orders","ar":"سلة جانبية وقائمة أمنيات وطلب مسبق"},{"en":"KNET, cards and Apple Pay (simulated)","ar":"كي-نت وبطاقات وApple Pay (محاكاة)"},{"en":"Loyalty points at checkout","ar":"نقاط ولاء عند الدفع"},{"en":"GCC currency display","ar":"عرض بعملات الخليج"}]',
 array['Next.js','Supabase','Motion','KNET','Apple Pay'], true, 30),
('marsa-chalets', 'booking-systems', 'elite', 'Marsa Chalets', 'شاليهات مرسى',
 'Chalet pages with an availability calendar, weekday / weekend / holiday pricing, a waitlist and a deposit checkout.',
 'صفحات شاليهات بتقويم توفر وأسعار لأيام الأسبوع ونهايته والأعياد وقائمة انتظار ودفع عربون.',
 'Brief: a family-owned chalet compound in Khiran loses bookings to WhatsApp back-and-forth about availability and weekend rates.

Solution: chalet pages with amenities, a Saturday-first availability calendar and seasonal price table; a booking flow with date range, guests, a live price breakdown per night, a 30% deposit summary, a waitlist for booked dates and a simulated KNET deposit step.

Result: the guest sees availability and the total before messaging; in production the owner gets a bookings dashboard, reminders and reports. The pricing engine is a pure function covered by unit tests.',
 'الفكرة: مجمع شاليهات عائلي في الخيران يخسر حجوزات بسبب رسائل واتساب المتكررة عن التوفر وأسعار نهاية الأسبوع.

الحل: صفحات شاليهات بالمرافق وتقويم توفر يبدأ بالسبت وجدول أسعار موسمي؛ وتدفق حجز بنطاق التواريخ وعدد الضيوف وتفاصيل السعر لكل ليلة وملخص عربون 30٪ وقائمة انتظار للتواريخ المحجوزة وخطوة دفع كي-نت محاكاة.

النتيجة: يرى الضيف التوفر والإجمالي قبل المراسلة؛ وفي الإنتاج يحصل المالك على لوحة حجوزات وتذكيرات وتقارير. محرك الأسعار دالة نقية مغطاة باختبارات.',
 '/demos/marsa-chalets/cover-en.jpg', '#0F7C8C', '/demo/marsa-chalets', 900, 1200, 50,
 '[{"en":"Availability calendar with booked dates","ar":"تقويم توفر مع التواريخ المحجوزة"},{"en":"Weekday, weekend and holiday rates","ar":"أسعار أيام الأسبوع ونهايته والأعياد"},{"en":"Minimum nights and capacity rules","ar":"حد أدنى لليالي وسعة الضيوف"},{"en":"30% deposit, balance at check-in","ar":"عربون 30٪ والباقي عند الوصول"},{"en":"Waitlist via WhatsApp","ar":"قائمة انتظار عبر واتساب"},{"en":"Unit-tested pricing engine","ar":"محرك أسعار مُختبر"}]',
 array['Next.js','Supabase','KNET','Vitest'], true, 40);

insert into public.projects (slug, category_id, tier, title_en, title_ar, summary_en, summary_ar, body_en, body_ar, cover_path, accent_color,
  demo_route, price_from_kwd, price_to_kwd, duration_days, features, tech_stack, is_concept, featured, published, sort_order)
select s.slug, c.id, s.tier, s.title_en, s.title_ar, s.summary_en, s.summary_ar, s.body_en, s.body_ar, s.cover_path, s.accent_color,
  s.demo_route, s.price_from, s.price_to, s.duration_days, s.features, s.tech_stack, true, s.featured, true, s.sort_order
from seed_projects s join public.categories c on c.slug = s.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id, tier = excluded.tier, title_en = excluded.title_en, title_ar = excluded.title_ar,
  summary_en = excluded.summary_en, summary_ar = excluded.summary_ar, body_en = excluded.body_en, body_ar = excluded.body_ar,
  cover_path = excluded.cover_path, accent_color = excluded.accent_color, demo_route = excluded.demo_route,
  price_from_kwd = excluded.price_from_kwd, price_to_kwd = excluded.price_to_kwd, duration_days = excluded.duration_days,
  features = excluded.features, tech_stack = excluded.tech_stack, featured = excluded.featured, sort_order = excluded.sort_order;

drop table seed_projects;
commit;
