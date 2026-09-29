-- Reference data. Idempotent: safe to re-run. Every value here is editable
-- in the admin panel afterwards; this only gives the site a complete first
-- state. Prices are KWD.

begin;

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name_en, name_ar, description_en, description_ar, icon, sort_order) values
  ('landing-pages', 'Landing pages', 'صفحات الهبوط',
   'One focused page that turns visitors into leads or sales.',
   'صفحة واحدة مركّزة تحوّل الزوار إلى عملاء.', 'rocket', 10),
  ('business-sites', 'Business websites', 'مواقع الشركات',
   'Multi-page sites that present your company, services and team.',
   'مواقع متعددة الصفحات تعرّف بشركتك وخدماتك وفريقك.', 'building-2', 20),
  ('portfolios', 'Portfolios', 'معارض الأعمال',
   'Galleries and case studies for creatives and professionals.',
   'معارض ودراسات حالة للمبدعين والمهنيين.', 'gallery-horizontal', 30),
  ('online-stores', 'Online stores', 'المتاجر الإلكترونية',
   'Shops with KNET and card payments, delivery zones and order management.',
   'متاجر مع الدفع عبر كي-نت والبطاقات، ومناطق التوصيل، وإدارة الطلبات.', 'shopping-bag', 40),
  ('restaurants', 'Restaurants & menus', 'المطاعم والقوائم',
   'Digital menus, reservations and online ordering.',
   'قوائم رقمية، وحجوزات، وطلب عبر الإنترنت.', 'utensils', 50),
  ('booking-systems', 'Booking systems', 'أنظمة الحجز',
   'Appointments, schedules, deposits and reminders for clinics, salons and studios.',
   'مواعيد وجداول وعربون وتذكيرات للعيادات والصالونات والاستوديوهات.', 'calendar-check', 60),
  ('web-apps', 'Web apps & dashboards', 'تطبيقات الويب ولوحات التحكم',
   'Custom tools with accounts, roles, reports and integrations.',
   'أدوات مخصصة مع حسابات وصلاحيات وتقارير وتكاملات.', 'layout-dashboard', 70)
on conflict (slug) do update set
  name_en = excluded.name_en, name_ar = excluded.name_ar,
  description_en = excluded.description_en, description_ar = excluded.description_ar,
  icon = excluded.icon, sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Packages (tiers). Generic rows (category null) describe a typical business
-- site and are the fallback; each category then overrides all three tiers.
-- ---------------------------------------------------------------------------
create temporary table seed_packages (
  category_slug text, tier public.tier, name_en text, name_ar text,
  tagline_en text, tagline_ar text, price_from numeric, price_to numeric,
  days_min int, days_max int, includes jsonb, highlighted boolean, sort_order int
) on commit drop;

insert into seed_packages values
-- generic
(null, 'starter', 'Starter', 'الأساسية', 'A polished start', 'بداية أنيقة', 350, 600, 7, 14,
 '[{"en":"Up to 5 pages","ar":"حتى 5 صفحات"},{"en":"Semi-custom design on a proven layout","ar":"تصميم شبه مخصص على هيكل مجرّب"},{"en":"One language (Arabic or English)","ar":"لغة واحدة (عربي أو إنجليزي)"},{"en":"Contact form + WhatsApp button","ar":"نموذج تواصل + زر واتساب"},{"en":"Hosting setup, SSL, analytics","ar":"إعداد الاستضافة وشهادة الأمان والتحليلات"},{"en":"30 days of post-launch fixes","ar":"30 يومًا من الإصلاحات بعد الإطلاق"}]', false, 1),
(null, 'professional', 'Professional', 'الاحترافية', 'Custom, bilingual, editable', 'مخصص، ثنائي اللغة، قابل للتعديل', 600, 1200, 21, 28,
 '[{"en":"Up to 8 pages, fully custom design","ar":"حتى 8 صفحات بتصميم مخصص بالكامل"},{"en":"Arabic + English with true RTL","ar":"عربي + إنجليزي مع دعم كامل للاتجاه"},{"en":"Admin panel to edit your content","ar":"لوحة تحكم لتعديل المحتوى"},{"en":"Motion and transitions","ar":"حركات وانتقالات"},{"en":"SEO setup and pixels","ar":"تهيئة محركات البحث وأدوات التتبع"},{"en":"1 month of Growth Care included","ar":"شهر مجاني من باقة النمو"}]', true, 2),
(null, 'elite', 'Elite', 'النخبة', 'Bespoke, end to end', 'مصمم خصيصًا من البداية للنهاية', 1200, 2500, 28, 42,
 '[{"en":"8–15 pages, brand-level bespoke design","ar":"8–15 صفحة بتصميم يعكس هوية العلامة"},{"en":"Advanced motion and scroll storytelling","ar":"حركات متقدمة وسرد بصري مع التمرير"},{"en":"Full CMS and multi-step forms","ar":"نظام إدارة محتوى كامل ونماذج متعددة الخطوات"},{"en":"Copywriting in Arabic and English","ar":"كتابة المحتوى بالعربية والإنجليزية"},{"en":"Technical SEO and performance tuning","ar":"تحسين تقني لمحركات البحث والأداء"},{"en":"Priority support during launch","ar":"دعم ذو أولوية أثناء الإطلاق"}]', false, 3),
-- landing pages
('landing-pages', 'starter', 'Starter', 'الأساسية', 'One page, one goal', 'صفحة واحدة، هدف واحد', 180, 300, 5, 7,
 '[{"en":"One page on a curated template, styled to your brand","ar":"صفحة واحدة على قالب منتقى بألوان علامتك"},{"en":"Contact and WhatsApp call-to-action","ar":"زر تواصل وواتساب"},{"en":"One language","ar":"لغة واحدة"},{"en":"Hosting, SSL, analytics","ar":"استضافة وشهادة أمان وتحليلات"}]', false, 1),
('landing-pages', 'professional', 'Professional', 'الاحترافية', 'Custom and bilingual', 'مخصص وثنائي اللغة', 300, 550, 7, 14,
 '[{"en":"Custom design with animated sections","ar":"تصميم مخصص مع أقسام متحركة"},{"en":"Arabic + English (RTL)","ar":"عربي + إنجليزي"},{"en":"Lead form saved to a database + email + WhatsApp alert","ar":"نموذج يُحفظ في قاعدة بيانات مع تنبيه بالبريد وواتساب"},{"en":"On-page SEO and ad pixels","ar":"تهيئة SEO وبكسلات الإعلانات"}]', true, 2),
('landing-pages', 'elite', 'Elite', 'النخبة', 'Built to convert', 'مصمم لتحقيق التحويلات', 550, 1000, 14, 21,
 '[{"en":"Conversion-focused bespoke design","ar":"تصميم مخصص يركز على التحويل"},{"en":"Scroll storytelling (GSAP)","ar":"سرد بصري مع التمرير"},{"en":"Copywriting in both languages","ar":"كتابة المحتوى باللغتين"},{"en":"A/B variant and CRM/ads integrations","ar":"نسخة اختبار A/B وتكامل مع CRM والإعلانات"},{"en":"Performance tuning","ar":"تحسين الأداء"}]', false, 3),
-- business sites
('business-sites', 'starter', 'Starter', 'الأساسية', 'Present your company', 'قدّم شركتك', 350, 600, 7, 14,
 '[{"en":"Up to 5 pages","ar":"حتى 5 صفحات"},{"en":"Semi-custom design","ar":"تصميم شبه مخصص"},{"en":"One language","ar":"لغة واحدة"},{"en":"Contact form and Google Maps","ar":"نموذج تواصل وخرائط جوجل"}]', false, 1),
('business-sites', 'professional', 'Professional', 'الاحترافية', 'Custom, bilingual, editable', 'مخصص، ثنائي اللغة، قابل للتعديل', 600, 1200, 21, 28,
 '[{"en":"Up to 8 pages, custom design","ar":"حتى 8 صفحات بتصميم مخصص"},{"en":"Arabic + English","ar":"عربي + إنجليزي"},{"en":"Editable services and news via admin","ar":"تعديل الخدمات والأخبار من لوحة التحكم"},{"en":"SEO setup, optional blog","ar":"تهيئة SEO ومدونة اختيارية"}]', true, 2),
('business-sites', 'elite', 'Elite', 'النخبة', 'Brand-level', 'بمستوى العلامة التجارية', 1200, 2500, 28, 42,
 '[{"en":"8–15 pages, bespoke design and motion","ar":"8–15 صفحة بتصميم وحركة مخصصة"},{"en":"Full CMS","ar":"نظام إدارة محتوى كامل"},{"en":"Copywriting","ar":"كتابة المحتوى"},{"en":"Schema and technical SEO","ar":"SEO تقني متقدم"},{"en":"Careers and multi-form flows","ar":"صفحات التوظيف ونماذج متعددة"}]', false, 3),
-- portfolios
('portfolios', 'starter', 'Starter', 'الأساسية', 'Show your work', 'اعرض أعمالك', 200, 350, 5, 7,
 '[{"en":"1–3 pages with a gallery grid","ar":"1–3 صفحات مع شبكة معرض"},{"en":"One language","ar":"لغة واحدة"},{"en":"Contact and social links","ar":"روابط التواصل"}]', false, 1),
('portfolios', 'professional', 'Professional', 'الاحترافية', 'Case studies you manage', 'دراسات حالة تديرها بنفسك', 350, 700, 14, 21,
 '[{"en":"Custom gallery and case-study layout","ar":"معرض ودراسات حالة بتصميم مخصص"},{"en":"Add projects yourself via admin","ar":"أضف مشاريعك بنفسك من لوحة التحكم"},{"en":"Arabic + English","ar":"عربي + إنجليزي"},{"en":"Lightbox and video","ar":"عرض الصور والفيديو"}]', true, 2),
('portfolios', 'elite', 'Elite', 'النخبة', 'Immersive', 'تجربة غامرة', 700, 1500, 21, 35,
 '[{"en":"Immersive motion and video backgrounds","ar":"حركات غامرة وخلفيات فيديو"},{"en":"Filtering and case-study system","ar":"تصفية ونظام دراسات حالة"},{"en":"Press and awards sections","ar":"أقسام الصحافة والجوائز"},{"en":"Custom typography","ar":"خطوط مخصصة"}]', false, 3),
-- online stores
('online-stores', 'starter', 'Starter', 'الأساسية', 'Start selling', 'ابدأ البيع', 600, 1000, 21, 28,
 '[{"en":"Up to 50 products","ar":"حتى 50 منتجًا"},{"en":"KNET + cards through one gateway (MyFatoorah or Tap)","ar":"كي-نت والبطاقات عبر بوابة واحدة"},{"en":"Cart, checkout, order emails","ar":"سلة ودفع ورسائل الطلبات"},{"en":"Basic admin, one language","ar":"لوحة تحكم أساسية، لغة واحدة"}]', false, 1),
('online-stores', 'professional', 'Professional', 'الاحترافية', 'A real shop', 'متجر متكامل', 1000, 2000, 35, 49,
 '[{"en":"Up to 300 products with variants","ar":"حتى 300 منتج مع الخيارات"},{"en":"Arabic + English, custom design","ar":"عربي + إنجليزي بتصميم مخصص"},{"en":"Orders, inventory, coupons","ar":"الطلبات والمخزون وأكواد الخصم"},{"en":"Kuwait delivery areas and fees","ar":"مناطق ورسوم التوصيل في الكويت"},{"en":"WhatsApp order alerts, SEO","ar":"تنبيهات الطلبات على واتساب وSEO"}]', true, 2),
('online-stores', 'elite', 'Elite', 'النخبة', 'Scale', 'للتوسع', 2000, 4500, 56, 84,
 '[{"en":"Unlimited products, customer accounts, wishlists, reviews","ar":"منتجات غير محدودة وحسابات عملاء وقوائم أمنيات وتقييمات"},{"en":"Multiple gateways and Apple Pay","ar":"عدة بوابات دفع وApple Pay"},{"en":"Subscriptions or pre-orders","ar":"اشتراكات أو طلبات مسبقة"},{"en":"Delivery-partner or POS integration","ar":"تكامل مع شركات التوصيل أو نقاط البيع"},{"en":"Loyalty, staff roles, advanced analytics","ar":"ولاء العملاء وصلاحيات الموظفين وتحليلات متقدمة"}]', false, 3),
-- restaurants
('restaurants', 'starter', 'Starter', 'الأساسية', 'Menu and location', 'القائمة والموقع', 250, 450, 7, 14,
 '[{"en":"Menu site + QR digital menu (Arabic and English menu text)","ar":"موقع القائمة + قائمة رقمية بـ QR (نصوص عربية وإنجليزية)"},{"en":"Location, hours, WhatsApp ordering","ar":"الموقع وساعات العمل والطلب عبر واتساب"}]', false, 1),
('restaurants', 'professional', 'Professional', 'الاحترافية', 'Manage it yourself', 'أدرها بنفسك', 450, 900, 14, 28,
 '[{"en":"Admin-managed menu: categories, items, availability, photos","ar":"قائمة تُدار من لوحة التحكم: أقسام وأصناف وتوفر وصور"},{"en":"Reservation requests","ar":"طلبات الحجز"},{"en":"Multiple branches and gallery","ar":"فروع متعددة ومعرض"}]', true, 2),
('restaurants', 'elite', 'Elite', 'النخبة', 'Online ordering', 'الطلب عبر الإنترنت', 900, 2000, 35, 56,
 '[{"en":"Online ordering with KNET","ar":"طلب عبر الإنترنت مع الدفع بكي-نت"},{"en":"Pickup and delivery zones","ar":"استلام ومناطق توصيل"},{"en":"Kitchen/order dashboard","ar":"لوحة الطلبات للمطبخ"},{"en":"Promo codes, loyalty, printable QR kits","ar":"أكواد ترويجية وولاء وأطقم QR للطباعة"}]', false, 3),
-- booking systems
('booking-systems', 'starter', 'Starter', 'الأساسية', 'Take requests', 'استقبل الطلبات', 400, 700, 14, 21,
 '[{"en":"Services and availability form","ar":"نموذج الخدمات والمواعيد المتاحة"},{"en":"Confirmations by email or WhatsApp","ar":"تأكيدات عبر البريد أو واتساب"},{"en":"Admin list of bookings","ar":"قائمة الحجوزات في لوحة التحكم"}]', false, 1),
('booking-systems', 'professional', 'Professional', 'الاحترافية', 'Scheduling that runs itself', 'جدولة تعمل تلقائيًا', 700, 1400, 28, 42,
 '[{"en":"Staff and branch scheduling","ar":"جدولة الموظفين والفروع"},{"en":"Admin calendar and reminders","ar":"تقويم في لوحة التحكم وتذكيرات"},{"en":"Deposits via KNET","ar":"عربون عبر كي-نت"},{"en":"Customer accounts and cancellations","ar":"حسابات العملاء والإلغاءات"}]', true, 2),
('booking-systems', 'elite', 'Elite', 'النخبة', 'Multi-branch operations', 'تشغيل متعدد الفروع', 1400, 3000, 42, 70,
 '[{"en":"Multiple branches and resources","ar":"فروع وموارد متعددة"},{"en":"Packages, memberships, waitlists","ar":"باقات وعضويات وقوائم انتظار"},{"en":"Reporting","ar":"تقارير"},{"en":"Google Calendar and SMS integrations","ar":"تكامل مع تقويم جوجل والرسائل النصية"},{"en":"Staff app views","ar":"واجهات للموظفين"}]', false, 3),
-- web apps
('web-apps', 'starter', 'Starter', 'الأساسية', 'MVP', 'النسخة الأولى', 800, 1500, 21, 35,
 '[{"en":"Authentication","ar":"تسجيل الدخول"},{"en":"2–4 data modules (create, edit, list)","ar":"2–4 وحدات بيانات (إضافة وتعديل وعرض)"},{"en":"Dashboard and basic roles","ar":"لوحة تحكم وصلاحيات أساسية"}]', false, 1),
('web-apps', 'professional', 'Professional', 'الاحترافية', 'Ready for a team', 'جاهز لفريق عمل', 1500, 3500, 42, 70,
 '[{"en":"Roles and permissions","ar":"أدوار وصلاحيات"},{"en":"Reports and charts","ar":"تقارير ورسوم بيانية"},{"en":"File storage and notifications","ar":"تخزين ملفات وإشعارات"},{"en":"1–2 API integrations, audit basics","ar":"تكامل مع 1–2 واجهة برمجية وسجل أساسي"}]', true, 2),
('web-apps', 'elite', 'Elite', 'النخبة', 'Complex systems', 'أنظمة معقدة', 3500, 8000, 70, 112,
 '[{"en":"Complex workflows and multi-tenant","ar":"مسارات عمل معقدة ودعم عدة جهات"},{"en":"Payments and subscriptions","ar":"مدفوعات واشتراكات"},{"en":"Real-time features and exports","ar":"ميزات فورية وتصدير البيانات"},{"en":"Audit logs and SLA","ar":"سجلات تدقيق واتفاقية مستوى خدمة"}]', false, 3);

insert into public.packages (category_id, tier, name_en, name_ar, tagline_en, tagline_ar,
  price_from_kwd, price_to_kwd, delivery_days_min, delivery_days_max, includes, highlighted, sort_order)
select c.id, s.tier, s.name_en, s.name_ar, s.tagline_en, s.tagline_ar, s.price_from, s.price_to,
       s.days_min, s.days_max, s.includes, s.highlighted, s.sort_order
from seed_packages s
left join public.categories c on c.slug = s.category_slug
on conflict (category_id, tier) do update set
  name_en = excluded.name_en, name_ar = excluded.name_ar,
  tagline_en = excluded.tagline_en, tagline_ar = excluded.tagline_ar,
  price_from_kwd = excluded.price_from_kwd, price_to_kwd = excluded.price_to_kwd,
  delivery_days_min = excluded.delivery_days_min, delivery_days_max = excluded.delivery_days_max,
  includes = excluded.includes, highlighted = excluded.highlighted, sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Price factors (what makes the price higher)
-- ---------------------------------------------------------------------------
insert into public.price_factors (slug, name_en, name_ar, description_en, description_ar, example_en, example_ar,
  delta_from_kwd, delta_to_kwd, pricing_mode, unit_label_en, unit_label_ar, max_units, in_calculator, sort_order) values
  ('extra-pages', 'Extra pages', 'صفحات إضافية',
   'Each designed page beyond the package.', 'كل صفحة مصممة تزيد عن الباقة.',
   'A business site growing from 8 to 12 pages.', 'موقع شركة يزيد من 8 إلى 12 صفحة.',
   30, 60, 'per_unit', 'page', 'صفحة', 20, true, 10),
  ('custom-design', 'Fully custom design', 'تصميم مخصص بالكامل',
   'A layout drawn from scratch for you instead of a curated template.', 'تصميم يُرسم من الصفر بدل قالب منتقى.',
   'Starter landing page upgraded to a bespoke layout.', 'صفحة هبوط أساسية بتصميم فريد.',
   100, 250, 'flat', null, null, null, true, 20),
  ('bilingual', 'Arabic + English (RTL)', 'عربي + إنجليزي',
   'Mirrored layouts, Arabic typography and content entered in both languages.', 'تخطيط معكوس وخطوط عربية وإدخال المحتوى باللغتين.',
   'Adding Arabic to an English-only site.', 'إضافة العربية لموقع إنجليزي فقط.',
   100, 300, 'flat', null, null, null, true, 30),
  ('copywriting', 'Copywriting', 'كتابة المحتوى',
   'Writing your page text in Arabic and English.', 'كتابة نصوص صفحاتك بالعربية والإنجليزية.',
   'Headlines and service descriptions for an 8-page site.', 'عناوين ووصف الخدمات لموقع من 8 صفحات.',
   30, 45, 'per_unit', 'page', 'صفحة', 20, true, 40),
  ('product-entry', 'Product entry', 'إدخال المنتجات',
   'Entering and formatting products, photos and variants.', 'إدخال المنتجات وصورها وخياراتها وتنسيقها.',
   'A store growing from 50 to 300 products.', 'متجر يزيد من 50 إلى 300 منتج.',
   0.5, 1, 'per_unit', 'product', 'منتج', 1000, true, 50),
  ('payment-gateway', 'Payment gateway', 'بوابة الدفع',
   'KNET and cards through a hosted gateway such as MyFatoorah or Tap.', 'كي-نت والبطاقات عبر بوابة مثل MyFatoorah أو Tap.',
   'Accepting payments on a booking or restaurant site.', 'قبول الدفع في موقع حجز أو مطعم.',
   80, 150, 'flat', null, null, null, true, 60),
  ('extra-payment-options', 'Extra payment options', 'خيارات دفع إضافية',
   'A second gateway, Apple Pay, or a direct bank KNET integration.', 'بوابة ثانية أو Apple Pay أو ربط كي-نت مباشر مع البنك.',
   'Adding Apple Pay to an existing checkout.', 'إضافة Apple Pay لعملية دفع قائمة.',
   50, 400, 'flat', null, null, null, true, 70),
  ('admin-dashboard', 'Admin dashboard', 'لوحة تحكم',
   'Edit services, projects, menus or orders yourself without a developer.', 'عدّل الخدمات أو المشاريع أو القوائم أو الطلبات بنفسك دون مطوّر.',
   'A restaurant owner updating the menu and prices.', 'صاحب مطعم يحدّث القائمة والأسعار.',
   200, 500, 'flat', null, null, null, true, 80),
  ('booking-engine', 'Booking engine', 'محرك الحجز',
   'Calendars, staff availability, deposits and reminders.', 'تقويم وتوفر الموظفين وعربون وتذكيرات.',
   'A salon adding staff calendars to its website.', 'صالون يضيف تقويم الموظفين إلى موقعه.',
   300, 800, 'flat', null, null, null, true, 90),
  ('animations', 'Advanced animations', 'حركات متقدمة',
   'Stripe-style transitions and scroll-driven scenes.', 'انتقالات بأسلوب Stripe ومشاهد تتحرك مع التمرير.',
   'A product page that animates as you scroll.', 'صفحة منتج تتحرك أثناء التمرير.',
   100, 400, 'flat', null, null, null, true, 100),
  ('seo', 'SEO setup', 'تهيئة محركات البحث',
   'Technical setup, metadata, sitemap, structured data and Search Console.', 'إعداد تقني وبيانات وصفية وخريطة موقع وبيانات منظمة وSearch Console.',
   'Ranking for “dental clinic Kuwait”.', 'الظهور في نتائج البحث عن «عيادة أسنان الكويت».',
   80, 200, 'flat', null, null, null, true, 110),
  ('integrations', 'Integrations', 'تكاملات',
   'Google Maps, WhatsApp Business API, SMS, delivery partners, POS or CRM.', 'خرائط جوجل وواتساب للأعمال والرسائل النصية وشركات التوصيل ونقاط البيع وCRM.',
   'Sending orders to a delivery company automatically.', 'إرسال الطلبات تلقائيًا لشركة التوصيل.',
   50, 150, 'per_unit', 'integration', 'تكامل', 10, true, 120),
  ('multi-branch', 'Multiple branches or currencies', 'فروع أو عملات متعددة',
   'Separate branches, hours and menus, or prices shown in several currencies.', 'فروع وساعات وقوائم منفصلة، أو أسعار بعدة عملات.',
   'A restaurant with four branches.', 'مطعم بأربعة فروع.',
   80, 200, 'flat', null, null, null, true, 130),
  ('rush-delivery', 'Rush delivery', 'تسليم عاجل',
   'Half the standard timeline adds 25%; under a week adds 50%.', 'نصف المدة المعتادة يضيف 25٪، وأقل من أسبوع يضيف 50٪.',
   'A four-week site delivered in two.', 'موقع مدته أربعة أسابيع يُسلَّم في أسبوعين.',
   25, 50, 'percent', null, null, null, true, 140)
on conflict (slug) do update set
  name_en = excluded.name_en, name_ar = excluded.name_ar,
  description_en = excluded.description_en, description_ar = excluded.description_ar,
  example_en = excluded.example_en, example_ar = excluded.example_ar,
  delta_from_kwd = excluded.delta_from_kwd, delta_to_kwd = excluded.delta_to_kwd,
  pricing_mode = excluded.pricing_mode, unit_label_en = excluded.unit_label_en,
  unit_label_ar = excluded.unit_label_ar, max_units = excluded.max_units,
  in_calculator = excluded.in_calculator, sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Maintenance plans
-- ---------------------------------------------------------------------------
insert into public.maintenance_plans (slug, name_en, name_ar, price_kwd_month, includes, highlighted, sort_order) values
  ('essential-care', 'Essential Care', 'العناية الأساسية', 25,
   '[{"en":"Hosting, SSL and DNS","ar":"استضافة وشهادة أمان وDNS"},{"en":"Uptime monitoring and weekly backups","ar":"مراقبة التشغيل ونسخ احتياطي أسبوعي"},{"en":"Security and dependency updates","ar":"تحديثات الأمان والمكتبات"},{"en":"1 hour of content edits per month","ar":"ساعة تعديلات محتوى شهريًا"},{"en":"Support within 48 hours","ar":"دعم خلال 48 ساعة"}]', false, 1),
  ('growth-care', 'Growth Care', 'عناية النمو', 55,
   '[{"en":"Everything in Essential","ar":"كل ما في الأساسية"},{"en":"3 hours of edits per month","ar":"3 ساعات تعديلات شهريًا"},{"en":"Monthly performance and SEO snapshot","ar":"تقرير شهري للأداء وSEO"},{"en":"Payment and webhook monitoring","ar":"مراقبة المدفوعات والتكاملات"},{"en":"Priority WhatsApp support within 24 hours","ar":"دعم واتساب ذو أولوية خلال 24 ساعة"}]', true, 2),
  ('elite-care', 'Elite Care', 'عناية النخبة', 120,
   '[{"en":"8 hours of edits or development per month","ar":"8 ساعات تعديل أو تطوير شهريًا"},{"en":"Same-day response (Sat–Thu, 4–11 pm)","ar":"رد في نفس اليوم (السبت–الخميس، 4–11 مساءً)"},{"en":"Staging environment","ar":"بيئة تجريبية"},{"en":"Monthly analytics and conversion suggestions","ar":"تحليلات شهرية ومقترحات لزيادة التحويل"},{"en":"Catalogue and menu updates","ar":"تحديث الكتالوج والقوائم"}]', false, 3)
on conflict (slug) do update set
  name_en = excluded.name_en, name_ar = excluded.name_ar, price_kwd_month = excluded.price_kwd_month,
  includes = excluded.includes, highlighted = excluded.highlighted, sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Currencies (fixed rates per 1 KWD; owner-editable). Rounding steps keep
-- converted prices looking deliberate rather than computed.
-- ---------------------------------------------------------------------------
insert into public.currencies (code, name_en, name_ar, symbol, symbol_ar, rate_per_kwd, rounding, decimals, is_default, sort_order) values
  ('KWD', 'Kuwaiti dinar', 'دينار كويتي', 'KD', 'د.ك', 1, 5, 0, true, 1),
  ('USD', 'US dollar', 'دولار أمريكي', '$', '$', 3.25, 10, 0, false, 2),
  ('SAR', 'Saudi riyal', 'ريال سعودي', 'SAR', 'ر.س', 12.20, 50, 0, false, 3),
  ('AED', 'UAE dirham', 'درهم إماراتي', 'AED', 'د.إ', 11.95, 50, 0, false, 4),
  ('QAR', 'Qatari riyal', 'ريال قطري', 'QAR', 'ر.ق', 11.85, 50, 0, false, 5),
  ('BHD', 'Bahraini dinar', 'دينار بحريني', 'BD', 'د.ب', 1.22, 5, 0, false, 6),
  ('OMR', 'Omani rial', 'ريال عماني', 'OMR', 'ر.ع', 1.25, 5, 0, false, 7)
on conflict (code) do update set
  name_en = excluded.name_en, name_ar = excluded.name_ar, symbol = excluded.symbol,
  symbol_ar = excluded.symbol_ar, rate_per_kwd = excluded.rate_per_kwd,
  rounding = excluded.rounding, decimals = excluded.decimals, sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Site settings
-- ---------------------------------------------------------------------------
insert into public.site_settings (key, value, is_public) values
  ('studio_name', '{"en":"Studio","ar":"ستوديو"}', true),
  ('whatsapp_number', '"+96560643311"', true),
  ('instagram_handle', '""', true),
  ('contact_email', '""', true),
  ('hours', '{"en":"Saturday – Thursday, 4 – 11 pm","ar":"السبت – الخميس، 4 – 11 مساءً"}', true),
  ('location', '{"en":"Kuwait City, Kuwait","ar":"مدينة الكويت، الكويت"}', true),
  ('payment_terms', '{"en":"50% to start, 50% at launch","ar":"50٪ عند البدء و50٪ عند الإطلاق"}', true),
  ('notify_email', '""', false)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- FAQs
-- ---------------------------------------------------------------------------
insert into public.faqs (question_en, question_ar, answer_en, answer_ar, sort_order) values
  ('How long does a website take?', 'كم يستغرق بناء الموقع؟',
   'Starter sites take about one to two weeks, Professional three to six, and Elite six to twelve. Stores and web apps take longer. You get a timeline before we start.',
   'المواقع الأساسية تستغرق أسبوعًا إلى أسبوعين، والاحترافية من ثلاثة إلى ستة أسابيع، والنخبة من ستة إلى اثني عشر. المتاجر وتطبيقات الويب تحتاج وقتًا أطول. تحصل على جدول زمني قبل أن نبدأ.', 10),
  ('What do I need to provide?', 'ما الذي عليّ توفيره؟',
   'Your logo (or we design a simple one), your text and photos if you have them, and your login for the domain if you already own one. Everything else is on me.',
   'شعارك (أو نصمم لك شعارًا بسيطًا)، ونصوصك وصورك إن وُجدت، وبيانات الدخول للنطاق إن كنت تملكه. كل ما عدا ذلك عليّ.', 20),
  ('How do payments work?', 'كيف يتم الدفع؟',
   'Half at the start and half at launch, in KWD. Prices in other currencies are shown for reference and converted at a fixed rate.',
   'النصف عند البدء والنصف عند الإطلاق، بالدينار الكويتي. الأسعار بالعملات الأخرى للاستئناس وتُحوَّل بسعر ثابت.', 30),
  ('Do you provide the domain and hosting?', 'هل توفر النطاق والاستضافة؟',
   'Yes. Hosting setup and SSL are included in every package. The domain is registered in your name so you always own it.',
   'نعم. إعداد الاستضافة وشهادة الأمان مشمولان في كل باقة. يُسجَّل النطاق باسمك لتبقى مالكه دائمًا.', 40),
  ('Can I edit the content myself?', 'هل يمكنني تعديل المحتوى بنفسي؟',
   'From the Professional tier up you get an admin panel to edit text, images, services, menus or products without touching code.',
   'من الباقة الاحترافية فما فوق تحصل على لوحة تحكم لتعديل النصوص والصور والخدمات والقوائم أو المنتجات دون لمس الكود.', 50),
  ('Is Arabic supported?', 'هل تدعم اللغة العربية؟',
   'Fully, including right-to-left layouts and Arabic typography. It is included from the Professional tier and available as an add-on for Starter.',
   'بالكامل، بما في ذلك التخطيط من اليمين لليسار والخطوط العربية. مشمولة من الباقة الاحترافية ومتاحة كإضافة للأساسية.', 60),
  ('How many revisions are included?', 'كم عدد التعديلات المشمولة؟',
   'Two rounds of revisions on the design and one on the final build, plus 30 days of fixes after launch.',
   'جولتان من التعديلات على التصميم وجولة على النسخة النهائية، بالإضافة إلى 30 يومًا من الإصلاحات بعد الإطلاق.', 70),
  ('Who owns the website?', 'من يملك الموقع؟',
   'You do. The domain, the code and the content are yours once the final payment is made.',
   'أنت. النطاق والكود والمحتوى ملكك بمجرد سداد الدفعة الأخيرة.', 80),
  ('Do you work with clients outside Kuwait?', 'هل تعمل مع عملاء خارج الكويت؟',
   'Yes, across the Gulf. Everything happens over WhatsApp and video calls, and prices can be viewed in your currency.',
   'نعم، في جميع دول الخليج. كل شيء يتم عبر واتساب ومكالمات الفيديو، ويمكنك عرض الأسعار بعملتك.', 90)
on conflict do nothing;

commit;
