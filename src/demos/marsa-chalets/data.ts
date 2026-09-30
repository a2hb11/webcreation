import type { Chalet } from './pricing'

export type ChaletInfo = Chalet & { en: string; ar: string; tag_en: string; tag_ar: string; amenities: [string, string][] }

export const chalets: ChaletInfo[] = [
  { slug: 'sea-view', en: 'Sea View Chalet', ar: 'شاليه إطلالة البحر', tag_en: 'Front row, private pool', tag_ar: 'الصف الأول، مسبح خاص', weekday: 120, weekend: 180, holiday: 240, minNights: 1, capacity: 12, amenities: [['Private pool', 'مسبح خاص'], ['Beach access', 'وصول للشاطئ'], ['3 bedrooms', '3 غرف نوم'], ['BBQ area', 'منطقة شواء']] },
  { slug: 'garden', en: 'Garden Chalet', ar: 'شاليه الحديقة', tag_en: 'Shaded garden, family size', tag_ar: 'حديقة مظللة، للعائلات', weekday: 90, weekend: 140, holiday: 190, minNights: 1, capacity: 10, amenities: [['Shared pool', 'مسبح مشترك'], ['2 bedrooms', 'غرفتا نوم'], ['Kids playground', 'ملعب أطفال'], ['Majlis', 'مجلس']] },
  { slug: 'duplex', en: 'Duplex Chalet', ar: 'شاليه دوبلكس', tag_en: 'Two floors, two families', tag_ar: 'طابقان، عائلتان', weekday: 160, weekend: 240, holiday: 320, minNights: 2, capacity: 18, amenities: [['Private pool', 'مسبح خاص'], ['4 bedrooms', '4 غرف نوم'], ['Rooftop', 'سطح'], ['Two kitchens', 'مطبخان']] },
]

// Seeded blocked nights (already booked) per chalet.
export const blocked: Record<string, string[]> = {
  'sea-view': ['2026-10-08', '2026-10-09', '2026-10-22', '2026-10-23'],
  garden: ['2026-10-15', '2026-10-16'],
  duplex: ['2026-10-01', '2026-10-02', '2026-10-29', '2026-10-30'],
}
