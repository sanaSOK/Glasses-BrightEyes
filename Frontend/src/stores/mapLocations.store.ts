import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { wholesalerService } from '@/services/wholesaler.service';

export interface MapLocation {
  id: string;
  name: string;
  nameKhmer?: string;
  role: 'ADMIN' | 'WHOLESALER' | 'RETAILER';
  category: string;
  categoryKhmer?: string;
  address: string;
  addressKhmer?: string;
  district: string;
  districtKhmer?: string;
  province: string;
  provinceKhmer?: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  status?: string;
  verified?: boolean;
  tag?: string;
  tagKhmer?: string;
  description?: string;
  descriptionKhmer?: string;
  productsCount?: number;
  ordersCount?: number;
  inventoryCount?: number;
  isCustom?: boolean;
}

export interface ProvinceInfo {
  name: string;
  nameKhmer: string;
  nameEnglish: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const CAMBODIA_PROVINCES: ProvinceInfo[] = [
  { name: 'Phnom Penh', nameKhmer: 'រាជធានីភ្នំពេញ', nameEnglish: 'Phnom Penh', lat: 11.5564, lng: 104.9282, zoom: 12 },
  { name: 'Siem Reap', nameKhmer: 'ខេត្តសៀមរាប', nameEnglish: 'Siem Reap', lat: 13.3671, lng: 103.8448, zoom: 12 },
  { name: 'Battambang', nameKhmer: 'ខេត្តបាត់ដំបង', nameEnglish: 'Battambang', lat: 13.0957, lng: 103.2022, zoom: 12 },
  { name: 'Preah Sihanouk', nameKhmer: 'ខេត្តព្រះសីហនុ', nameEnglish: 'Preah Sihanouk', lat: 10.6253, lng: 103.5234, zoom: 12 },
  { name: 'Kampong Cham', nameKhmer: 'ខេត្តកំពង់ចាម', nameEnglish: 'Kampong Cham', lat: 11.9924, lng: 105.4645, zoom: 12 },
  { name: 'Kampot', nameKhmer: 'ខេត្តកំពត', nameEnglish: 'Kampot', lat: 10.6104, lng: 104.1818, zoom: 12 },
  { name: 'Kandal', nameKhmer: 'ខេត្តកណ្តាល', nameEnglish: 'Kandal', lat: 11.4588, lng: 104.9469, zoom: 11 },
  { name: 'Banteay Meanchey', nameKhmer: 'ខេត្តបន្ទាយមានជ័យ', nameEnglish: 'Banteay Meanchey', lat: 13.5859, lng: 102.9737, zoom: 11 },
  { name: 'Poipet', nameKhmer: 'ក្រុងប៉ោយប៉ែត', nameEnglish: 'Poipet', lat: 13.6561, lng: 102.5634, zoom: 13 },
  { name: 'Kampong Chhnang', nameKhmer: 'ខេត្តកំពង់ឆ្នាំង', nameEnglish: 'Kampong Chhnang', lat: 12.2500, lng: 104.6667, zoom: 11 },
  { name: 'Kampong Speu', nameKhmer: 'ខេត្តកំពង់ស្ពឺ', nameEnglish: 'Kampong Speu', lat: 11.4533, lng: 104.5209, zoom: 11 },
  { name: 'Kampong Thom', nameKhmer: 'ខេត្តកំពង់ធំ', nameEnglish: 'Kampong Thom', lat: 12.7111, lng: 104.8887, zoom: 11 },
  { name: 'Kep', nameKhmer: 'ខេត្តកែប', nameEnglish: 'Kep', lat: 10.4828, lng: 104.3167, zoom: 12 },
  { name: 'Koh Kong', nameKhmer: 'ខេត្តកោះកុង', nameEnglish: 'Koh Kong', lat: 11.6153, lng: 102.9838, zoom: 11 },
  { name: 'Kratié', nameKhmer: 'ខេត្តក្រចេះ', nameEnglish: 'Kratie', lat: 12.4881, lng: 106.0188, zoom: 11 },
  { name: 'Mondulkiri', nameKhmer: 'ខេត្តមណ្ឌលគិរី', nameEnglish: 'Mondulkiri', lat: 12.4558, lng: 107.1881, zoom: 11 },
  { name: 'Oddar Meanchey', nameKhmer: 'ខេត្តឧត្តរមានជ័យ', nameEnglish: 'Oddar Meanchey', lat: 14.1817, lng: 103.5176, zoom: 11 },
  { name: 'Pailin', nameKhmer: 'ខេត្តប៉ៃលិន', nameEnglish: 'Pailin', lat: 12.8489, lng: 102.6093, zoom: 12 },
  { name: 'Preah Vihear', nameKhmer: 'ខេត្តព្រះវិហារ', nameEnglish: 'Preah Vihear', lat: 13.8073, lng: 104.9805, zoom: 11 },
  { name: 'Prey Veng', nameKhmer: 'ខេត្តព្រៃវែង', nameEnglish: 'Prey Veng', lat: 11.4868, lng: 105.3253, zoom: 11 },
  { name: 'Pursat', nameKhmer: 'ខេត្តពោធិ៍សាត់', nameEnglish: 'Pursat', lat: 12.5388, lng: 103.9192, zoom: 11 },
  { name: 'Ratanakiri', nameKhmer: 'ខេត្តរតនគិរី', nameEnglish: 'Ratanakiri', lat: 13.7394, lng: 106.9873, zoom: 11 },
  { name: 'Stung Treng', nameKhmer: 'ខេត្តស្ទឹងត្រែង', nameEnglish: 'Stung Treng', lat: 13.5259, lng: 105.9683, zoom: 11 },
  { name: 'Svay Rieng', nameKhmer: 'ខេត្តស្វាយរៀង', nameEnglish: 'Svay Rieng', lat: 11.0879, lng: 105.7993, zoom: 11 },
  { name: 'Takéo', nameKhmer: 'ខេត្តតាកែវ', nameEnglish: 'Takeo', lat: 10.9908, lng: 104.7849, zoom: 11 },
  { name: 'Tboung Khmum', nameKhmer: 'ខេត្តត្បូងឃ្មុំ', nameEnglish: 'Tboung Khmum', lat: 11.9366, lng: 105.6593, zoom: 11 },
];

export const getProvinceKhmer = (name: string): string => {
  if (!name) return 'រាជធានីភ្នំពេញ';
  const found = CAMBODIA_PROVINCES.find(
    p => p.name.toLowerCase() === name.toLowerCase() || p.nameKhmer === name
  );
  return found ? found.nameKhmer : name;
};

export const DEFAULT_CAMBODIA_LOCATIONS: MapLocation[] = [
  // 1. ADMIN HQ
  {
    id: 'admin-hq-wat-phnom',
    name: 'BrightEyes Central HQ & Automated Lens Lab',
    nameKhmer: 'BrightEyes ទីស្នាក់ការកណ្តាល និងរោងចក្រកាត់កញ្ចក់វ៉ែនតាស្វ័យប្រវត្តិ',
    role: 'ADMIN',
    category: 'Platform Headquarters & Rx Surfacing Lab',
    categoryKhmer: 'ទីស្នាក់ការកណ្តាលប្រព័ន្ធ និងរោងចក្រផលិតកញ្ចក់វ៉ែនតា',
    address: 'Street 96, Sangkat Wat Phnom, Khan Daun Penh',
    addressKhmer: 'ផ្លូវ ៩៦ សង្កាត់វត្តភ្នំ ខណ្ឌដូនពេញ',
    district: 'Daun Penh',
    districtKhmer: 'ខណ្ឌដូនពេញ',
    province: 'Phnom Penh',
    provinceKhmer: 'រាជធានីភ្នំពេញ',
    phone: '+855 23 888 999',
    email: 'hq@brighteyes.com.kh',
    lat: 11.5761,
    lng: 104.9232,
    status: 'OPERATIONAL',
    verified: true,
    tag: 'Platform HQ & Surfacing Lab',
    tagKhmer: 'ទីស្នាក់ការកណ្តាល',
    description: 'Central prescription surfacing matrix hub, digital freeform generator, and platform governance center.',
    descriptionKhmer: 'មជ្ឈមណ្ឌលកាត់កញ្ចក់វ៉ែនតាម៉ាស៊ីនស្វ័យប្រវត្តិ និងគ្រប់គ្រងការផ្គត់ផ្គង់ទូទាំងប្រទេសកម្ពុជា។',
    productsCount: 1500,
    ordersCount: 420,
  },

  // 2. WHOLESALERS
  {
    id: 'ws-sokha-optical',
    name: 'Sokha Optical Supply Co., Ltd',
    nameKhmer: 'សុខា អុបទិក ខូអិលធីឌី (អ្នកលក់ដុំវ៉ែនតា)',
    role: 'WHOLESALER',
    category: 'Authorized Luxury Frames & Sunglasses Importer',
    categoryKhmer: 'អ្នកនាំចូលដុំ ស៊ុមវ៉ែនតា និងវ៉ែនតាការពារកម្ដៅថ្ងៃលំដាប់ប្រណិត',
    address: 'St 214, Sangkat Boeung Keng Kang 1, Khan Boeng Keng Kang',
    addressKhmer: 'ផ្លូវ ២១៤ សង្កាត់បឹងកេងកង១ ខណ្ឌបឹងកេងកង',
    district: 'Boeng Keng Kang',
    districtKhmer: 'ខណ្ឌបឹងកេងកង',
    province: 'Phnom Penh',
    provinceKhmer: 'រាជធានីភ្នំពេញ',
    phone: '+855 12 887 766',
    email: 'sales@sokha-optics.com.kh',
    lat: 11.5524,
    lng: 104.9282,
    status: 'ACTIVE',
    verified: true,
    tag: 'Verified Wholesaler',
    tagKhmer: 'អ្នកផ្គត់ផ្គង់បោះដុំ',
    description: 'Exclusive wholesale distributor for Ray-Ban, Oakley, Gucci, Prada, and premium titanium frames.',
    descriptionKhmer: 'អ្នកចែកចាយបោះដុំស្របច្បាប់ផ្តាច់មុខសម្រាប់ Ray-Ban, Oakley, Gucci, Prada និងស៊ុមទីតានីញ៉ូម។',
    productsCount: 340,
    ordersCount: 185,
  },
  {
    id: 'ws-angkor-lens',
    name: 'Angkor Vision & Precision Lens Wholesale',
    nameKhmer: 'អង្គរ វីហ្សិន និងលក់ដុំកញ្ចក់វ៉ែនតាវេជ្ជសាស្ត្រ',
    role: 'WHOLESALER',
    category: 'Ophthalmic Lenses & Laboratory Optics',
    categoryKhmer: 'កញ្ចក់វ៉ែនតាវេជ្ជសាស្ត្រ និងសម្ភារៈបន្ទប់ពិសោធន៍អុបទិក',
    address: 'St 315, Sangkat Boeung Kak 1, Khan Toul Kork',
    addressKhmer: 'ផ្លូវ ៣១៥ សង្កាត់បឹងកក់១ ខណ្ឌទួលគោក',
    district: 'Toul Kork',
    districtKhmer: 'ខណ្ឌទួលគោក',
    province: 'Phnom Penh',
    provinceKhmer: 'រាជធានីភ្នំពេញ',
    phone: '+855 16 990 011',
    email: 'wholesale@angkorvision.com',
    lat: 11.5721,
    lng: 104.8965,
    status: 'ACTIVE',
    verified: true,
    tag: 'Verified Wholesaler',
    tagKhmer: 'អ្នកផ្គត់ផ្គង់បោះដុំ',
    description: 'Authorized wholesale stockist of Essilor, Hoya, Carl Zeiss single vision, progressive, and photochromic blanks.',
    descriptionKhmer: 'អ្នកចែកចាយបោះដុំកញ្ចក់ Essilor, Hoya, Carl Zeiss កញ្ចក់ពន្លឺថ្ងៃ និងកញ្ចក់ប្ល៊ូខាត់។',
    productsCount: 520,
    ordersCount: 240,
  },
  {
    id: 'ws-battambang-frames',
    name: 'Battambang Precision Optics Importers',
    nameKhmer: 'បាត់ដំបង អុបទិក នាំចូលវ៉ែនតាកម្រិតខ្ពស់',
    role: 'WHOLESALER',
    category: 'Regional Frames & Optical Hardware Hub',
    categoryKhmer: 'មជ្ឈមណ្ឌលចែកចាយស៊ុមវ៉ែនតាតំបន់ពាយ័ព្យ',
    address: 'Street 3, Sangkat Svay Pao, Krong Battambang',
    addressKhmer: 'ផ្លូវលេខ ៣ សង្កាត់ស្វាយប៉ោ ក្រុងបាត់ដំបង',
    district: 'Svay Pao',
    districtKhmer: 'សង្កាត់ស្វាយប៉ោ',
    province: 'Battambang',
    provinceKhmer: 'ខេត្តបាត់ដំបង',
    phone: '+855 53 952 110',
    email: 'battambang@brighteyes.supplier.kh',
    lat: 13.1022,
    lng: 103.1985,
    status: 'ACTIVE',
    verified: true,
    tag: 'Northwest Wholesaler',
    tagKhmer: 'អ្នកផ្គត់ផ្គង់បោះដុំ',
    description: 'Northwest Cambodia wholesale depot servicing optical clinics across Battambang, Banteay Meanchey, and Pailin.',
    descriptionKhmer: 'ឃ្លាំងលក់ដុំផ្គត់ផ្គង់គ្លីនិកវាស់ភ្នែកខេត្តបាត់ដំបង បន្ទាយមានជ័យ និងប៉ៃលិន។',
    productsCount: 210,
    ordersCount: 88,
  },
  {
    id: 'ws-siemreap-depot',
    name: 'Siem Reap Optical Wholesale Depot',
    nameKhmer: 'ឃ្លាំងលក់ដុំវ៉ែនតាសៀមរាប',
    role: 'WHOLESALER',
    category: 'Designer Eyewear & Contact Lenses',
    categoryKhmer: 'វ៉ែនតាម៉ាកល្បីៗ និងកញ្ចក់កុងតាក់លេន',
    address: 'National Road 6, Sangkat Svay Dangkum, Krong Siem Reap',
    addressKhmer: 'ផ្លូវជាតិលេខ ៦ សង្កាត់ស្វាយដង្គំ ក្រុងសៀមរាប',
    district: 'Svay Dangkum',
    districtKhmer: 'សង្កាត់ស្វាយដង្គំ',
    province: 'Siem Reap',
    provinceKhmer: 'ខេត្តសៀមរាប',
    phone: '+855 63 760 888',
    email: 'siemreap-wholesale@brighteyes.kh',
    lat: 13.3615,
    lng: 103.8562,
    status: 'ACTIVE',
    verified: true,
    tag: 'Northern Hub Wholesaler',
    tagKhmer: 'អ្នកផ្គត់ផ្គង់បោះដុំ',
    description: 'Full-service wholesale hub for tourist and medical optical practices in Siem Reap, Preah Vihear, and Oddar Meanchey.',
    descriptionKhmer: 'មជ្ឈមណ្ឌលលក់ដុំសម្រាប់ហាងវ៉ែនតា និងគ្លីនិកភ្នែកក្នុងខេត្តសៀមរាប និងព្រះវិហារ។',
    productsCount: 295,
    ordersCount: 112,
  },

  // 3. RETAILERS
  {
    id: 'ret-phnompenh-optics',
    name: 'Phnom Penh Eyewear & Optometry Center',
    nameKhmer: 'ភ្នំពេញ អាយវែរ និងគ្លីនិកវាស់ភ្នែក',
    role: 'RETAILER',
    category: 'Premier Optical Retail Store',
    categoryKhmer: 'ហាងលក់រាយវ៉ែនតា និងសេវាពិនិត្យគំហើញ',
    address: 'St 271, Sangkat Teuk Thla, Khan Sen Sok',
    addressKhmer: 'ផ្លូវ ២៧១ សង្កាត់ទឹកថ្លា ខណ្ឌសែនសុខ',
    district: 'Sen Sok',
    districtKhmer: 'ខណ្ឌសែនសុខ',
    province: 'Phnom Penh',
    provinceKhmer: 'រាជធានីភ្នំពេញ',
    phone: '+855 23 991 234',
    email: 'store@phnompenh-eyewear.com',
    lat: 11.5645,
    lng: 104.8878,
    status: 'ACTIVE',
    verified: true,
    tag: 'Certified Retailer',
    tagKhmer: 'ហាងលក់រាយវ៉ែនតា',
    description: 'Full-service optometry clinic equipped with computerized refraction, prescription dispensing, and frame fitting.',
    descriptionKhmer: 'គ្លីនិកវាស់ភ្នែកកុំព្យូទ័រ កាត់កញ្ចក់វ៉ែនតា និងលក់រាយស៊ុមវ៉ែនតាទំនើប។',
    inventoryCount: 420,
    ordersCount: 64,
  },
  {
    id: 'ret-angkor-eye-clinic',
    name: 'Siem Reap Vision Care Clinic & Boutique',
    nameKhmer: 'សៀមរាប វីហ្សិន ឃែរ គ្លីនិក និងហាងវ៉ែនតា',
    role: 'RETAILER',
    category: 'Optical Retail Boutique',
    categoryKhmer: 'ហាងលក់រាយវ៉ែនតា និងពិនិត្យគំហើញ',
    address: 'Sivutha Boulevard, Krong Siem Reap',
    addressKhmer: 'មហាវិថីសីវុត្ថា ក្រុងសៀមរាប',
    district: 'Sivutha',
    districtKhmer: 'មហាវិថីសីវុត្ថា',
    province: 'Siem Reap',
    provinceKhmer: 'ខេត្តសៀមរាប',
    phone: '+855 63 963 852',
    email: 'vision@siemreapcare.com',
    lat: 13.3548,
    lng: 103.8541,
    status: 'ACTIVE',
    verified: true,
    tag: 'Certified Retailer',
    tagKhmer: 'ហាងលក់រាយវ៉ែនតា',
    description: 'Boutique optical shop specializing in sunglasses, polarized lenses, and quick-turnaround prescription spectacles.',
    descriptionKhmer: 'ហាងវ៉ែនតាជំនាញកាត់វ៉ែនតាការពារកម្ដៅថ្ងៃ វ៉ែនតាប្ល៊ូខាត់ និងវ៉ែនតាការពារកាំរស្មីយូវី។',
    inventoryCount: 310,
    ordersCount: 48,
  },
  {
    id: 'ret-battambang-vision',
    name: 'Battambang Central Optical House',
    nameKhmer: 'បាត់ដំបង សេនត្រល់ ហាងវ៉ែនតា',
    role: 'RETAILER',
    category: 'Optical Retail Store',
    categoryKhmer: 'ហាងលក់រាយវ៉ែនតា',
    address: 'Street 1, Phsar Nat area, Krong Battambang',
    addressKhmer: 'ផ្លូវលេខ ១ តំបន់ផ្សារណាត់ ក្រុងបាត់ដំបង',
    district: 'Phsar Nat',
    districtKhmer: 'តំបន់ផ្សារណាត់',
    province: 'Battambang',
    provinceKhmer: 'ខេត្តបាត់ដំបង',
    phone: '+855 53 730 456',
    email: 'central@battambangoptical.com',
    lat: 13.0988,
    lng: 103.2035,
    status: 'ACTIVE',
    verified: true,
    tag: 'Certified Retailer',
    tagKhmer: 'ហាងលក់រាយវ៉ែនតា',
    description: 'Trusted family-owned optical dispensary providing precision single-vision and progressive eyeglasses.',
    descriptionKhmer: 'ហាងវ៉ែនតាជំនាញកាត់កញ្ចក់វ៉ែនតាម៉ាស៊ីនឌីជីថល ពិនិត្យកម្រិតភ្នែកច្បាស់លាស់។',
    inventoryCount: 250,
    ordersCount: 36,
  },
  {
    id: 'ret-sihanouk-eyewear',
    name: 'Sihanoukville Coastal Vision Center',
    nameKhmer: 'ព្រះសីហនុ ខូសស្ទល វីហ្សិន សេនធ័រ',
    role: 'RETAILER',
    category: 'Optical Dispensary & Sunglasses Boutique',
    categoryKhmer: 'ហាងវ៉ែនតា និងវ៉ែនតាការពារពន្លឺថ្ងៃសមុទ្រ',
    address: 'Ekareach Street, Sangkat 2, Krong Preah Sihanouk',
    addressKhmer: 'ផ្លូវឯករាជ្យ សង្កាត់ ២ ក្រុងព្រះសីហនុ',
    district: 'Mittapheap',
    districtKhmer: 'សង្កាត់លេខ ២',
    province: 'Preah Sihanouk',
    provinceKhmer: 'ខេត្តព្រះសីហនុ',
    phone: '+855 34 933 678',
    email: 'coastal@sihanouk-eyes.com',
    lat: 10.6278,
    lng: 103.5265,
    status: 'ACTIVE',
    verified: true,
    tag: 'Certified Retailer',
    tagKhmer: 'ហាងលក់រាយវ៉ែនតា',
    description: 'Coastal optical dispensary offering UV400 prescription sunglasses, anti-reflective lenses, and designer frames.',
    descriptionKhmer: 'ហាងលក់រាយវ៉ែនតាតំបន់ឆ្នេរខេត្តព្រះសីហនុ ជំនាញវ៉ែនតា UV400 និងប៉ូឡារ៉យ។',
    inventoryCount: 190,
    ordersCount: 29,
  },
  {
    id: 'ret-kampongcham-optics',
    name: 'Kampong Cham Bright Optical Dispensary',
    nameKhmer: 'កំពង់ចាម ប្រាយ អុបទិក ហាងវ៉ែនតា',
    role: 'RETAILER',
    category: 'Optical Retail Store',
    categoryKhmer: 'ហាងលក់រាយវ៉ែនតា',
    address: 'National Road 7, Krong Kampong Cham',
    addressKhmer: 'ផ្លូវជាតិលេខ ៧ ក្រុងកំពង់ចាម',
    district: 'Kampong Cham',
    districtKhmer: 'ក្រុងកំពង់ចាម',
    province: 'Kampong Cham',
    provinceKhmer: 'ខេត្តកំពង់ចាម',
    phone: '+855 42 941 223',
    email: 'kpcham@brighteyes-store.kh',
    lat: 11.9950,
    lng: 105.4670,
    status: 'ACTIVE',
    verified: true,
    tag: 'Certified Retailer',
    tagKhmer: 'ហាងលក់រាយវ៉ែនតា',
    description: 'Serving Kampong Cham and Tboung Khmum provinces with digital lens edged glasses and eye exams.',
    descriptionKhmer: 'បម្រើសេវាកម្មកាត់វ៉ែនតា និងវាស់ភ្នែកសម្រាប់ខេត្តកំពង់ចាម និងខេត្តត្បូងឃ្មុំ។',
    inventoryCount: 220,
    ordersCount: 31,
  },
  {
    id: 'ret-kampot-eyes',
    name: 'Kampot Riverside Optical Studio',
    nameKhmer: 'កំពត រីវើសាយ ស្ទូឌីយោវ៉ែនតា',
    role: 'RETAILER',
    category: 'Optical Boutique',
    categoryKhmer: 'ហាងលក់រាយវ៉ែនតា',
    address: 'Old Market Street, Krong Kampot',
    addressKhmer: 'ផ្លូវផ្សារចាស់ ក្រុងកំពត',
    district: 'Kampot Riverside',
    districtKhmer: 'ក្រុងកំពត',
    province: 'Kampot',
    provinceKhmer: 'ខេត្តកំពត',
    phone: '+855 33 932 455',
    email: 'kampot@riverside-optics.com',
    lat: 10.6085,
    lng: 104.1795,
    status: 'ACTIVE',
    verified: true,
    tag: 'Certified Retailer',
    tagKhmer: 'ហាងលក់រាយវ៉ែនតា',
    description: 'Charming boutique providing optical frames, blue-cut computer lenses, and polarized sunglasses.',
    descriptionKhmer: 'ហាងវ៉ែនតាទល់មុខមាត់ព្រែកក្រុងកំពត ជំនាញកញ្ចក់ Blue-Cut ការពារពន្លឺកុំព្យូទ័រ។',
    inventoryCount: 160,
    ordersCount: 22,
  },
  {
    id: 'ret-poipet-border',
    name: 'Poipet Golden Border Optometry',
    nameKhmer: 'ប៉ោយប៉ែត ហ្គោលដិន បដឺ ហាងវ៉ែនតា',
    role: 'RETAILER',
    category: 'Optical Retail Store',
    categoryKhmer: 'ហាងលក់រាយវ៉ែនតា',
    address: 'National Road 5, Krong Poipet',
    addressKhmer: 'ផ្លូវជាតិលេខ ៥ ក្រុងប៉ោយប៉ែត',
    district: 'Poipet',
    districtKhmer: 'ក្រុងប៉ោយប៉ែត',
    province: 'Banteay Meanchey',
    provinceKhmer: 'ខេត្តបន្ទាយមានជ័យ',
    phone: '+855 54 967 890',
    email: 'border@poipetoptics.com',
    lat: 13.6542,
    lng: 102.5681,
    status: 'ACTIVE',
    verified: true,
    tag: 'Certified Retailer',
    tagKhmer: 'ហាងលក់រាយវ៉ែនតា',
    description: 'High-volume optical center catering to cross-border travelers and local businesses in Poipet.',
    descriptionKhmer: 'មជ្ឈមណ្ឌលកាត់វ៉ែនតានៅតំបន់ព្រំដែនក្រុងប៉ោយប៉ែត ខេត្តបន្ទាយមានជ័យ។',
    inventoryCount: 280,
    ordersCount: 41,
  },
];

const LOCAL_STORAGE_KEY = 'brighteyes_custom_registered_locations_v1';

export const useMapLocationsStore = defineStore('mapLocations', () => {
  const customLocations = ref<MapLocation[]>([]);
  const apiLocations = ref<{
    admin: MapLocation[];
    wholesalers: MapLocation[];
    retailers: MapLocation[];
  }>({
    admin: [],
    wholesalers: [],
    retailers: [],
  });

  const loading = ref(false);
  const selectedRoleFilter = ref<'ALL' | 'ADMIN' | 'WHOLESALER' | 'RETAILER'>('ALL');
  const selectedProvince = ref<string>('ALL');
  const searchQuery = ref<string>('');
  const activeLocationId = ref<string | null>(null);

  // Load custom locations saved locally
  const loadLocalLocations = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        customLocations.value = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse local map locations', e);
    }
  };

  // Save custom locations
  const saveLocalLocations = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customLocations.value));
    } catch (e) {
      console.warn('Failed to save local map locations', e);
    }
  };

  // Add newly registered location
  const addRegisteredLocation = (loc: Partial<MapLocation>) => {
    const newLoc: MapLocation = {
      id: loc.id || `custom-${Date.now()}`,
      name: loc.name || 'New Registered Store',
      role: loc.role || 'RETAILER',
      category: loc.role === 'WHOLESALER' ? 'Wholesale Optical Supplier' : 'Retail Optical Store',
      address: loc.address || 'Cambodia',
      district: loc.district || 'District',
      province: loc.province || 'Phnom Penh',
      phone: loc.phone || '+855 12 345 678',
      email: loc.email || 'user@brighteyes.com',
      lat: Number(loc.lat) || 11.5564,
      lng: Number(loc.lng) || 104.9282,
      status: 'ACTIVE',
      verified: true,
      tag: 'Newly Registered',
      description: loc.description || 'Recently onboarded optical partner on BrightEyes B2B network.',
      isCustom: true,
      ordersCount: 0,
      productsCount: 0,
      inventoryCount: 0,
    };

    // Prepend to custom locations
    customLocations.value = [newLoc, ...customLocations.value.filter(item => item.id !== newLoc.id)];
    saveLocalLocations();
    return newLoc;
  };

  // Fetch from backend
  const fetchLocations = async () => {
    loading.value = true;
    loadLocalLocations();
    try {
      const data = await wholesalerService.getMapLocations();
      if (data && (data.admin || data.wholesalers || data.retailers)) {
        apiLocations.value = {
          admin: data.admin || [],
          wholesalers: data.wholesalers || [],
          retailers: data.retailers || [],
        };
      }
    } catch (err) {
      console.warn('API getMapLocations failed or running offline, using seed locations', err);
    } finally {
      loading.value = false;
    }
  };

  // Merged all locations
  const allLocations = computed<MapLocation[]>(() => {
    const list: MapLocation[] = [];

    // 1. Check API Admin or Default Admin
    if (apiLocations.value.admin && apiLocations.value.admin.length > 0) {
      list.push(...apiLocations.value.admin);
    } else {
      list.push(...DEFAULT_CAMBODIA_LOCATIONS.filter(item => item.role === 'ADMIN'));
    }

    // 2. Wholesalers (API + Default without duplicate IDs)
    const existingIds = new Set(list.map(i => i.id));
    if (apiLocations.value.wholesalers && apiLocations.value.wholesalers.length > 0) {
      for (const w of apiLocations.value.wholesalers) {
        if (!existingIds.has(w.id)) {
          list.push(w);
          existingIds.add(w.id);
        }
      }
    }
    // Add default wholesalers if not present
    for (const w of DEFAULT_CAMBODIA_LOCATIONS.filter(i => i.role === 'WHOLESALER')) {
      if (!existingIds.has(w.id)) {
        list.push(w);
        existingIds.add(w.id);
      }
    }

    // 3. Retailers (API + Default without duplicate IDs)
    if (apiLocations.value.retailers && apiLocations.value.retailers.length > 0) {
      for (const r of apiLocations.value.retailers) {
        if (!existingIds.has(r.id)) {
          list.push(r);
          existingIds.add(r.id);
        }
      }
    }
    for (const r of DEFAULT_CAMBODIA_LOCATIONS.filter(i => i.role === 'RETAILER')) {
      if (!existingIds.has(r.id)) {
        list.push(r);
        existingIds.add(r.id);
      }
    }

    // 4. Custom newly registered locations at top
    for (const c of customLocations.value) {
      if (!existingIds.has(c.id)) {
        list.unshift(c);
        existingIds.add(c.id);
      }
    }

    return list;
  });

  // Filtered locations
  const filteredLocations = computed<MapLocation[]>(() => {
    return allLocations.value.filter(loc => {
      // Role filter
      if (selectedRoleFilter.value !== 'ALL' && loc.role !== selectedRoleFilter.value) {
        return false;
      }
      // Province filter
      if (selectedProvince.value !== 'ALL' && loc.province.toLowerCase() !== selectedProvince.value.toLowerCase()) {
        return false;
      }
      // Search text
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim();
        const matchesName = loc.name?.toLowerCase().includes(q);
        const matchesAddress = loc.address?.toLowerCase().includes(q);
        const matchesDistrict = loc.district?.toLowerCase().includes(q);
        const matchesProvince = loc.province?.toLowerCase().includes(q);
        const matchesCategory = loc.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesAddress && !matchesDistrict && !matchesProvince && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  });

  // Role Counts
  const counts = computed(() => {
    const all = allLocations.value;
    return {
      total: all.length,
      admin: all.filter(i => i.role === 'ADMIN').length,
      wholesalers: all.filter(i => i.role === 'WHOLESALER').length,
      retailers: all.filter(i => i.role === 'RETAILER').length,
      provinces: new Set(all.map(i => i.province)).size,
    };
  });

  return {
    customLocations,
    apiLocations,
    loading,
    selectedRoleFilter,
    selectedProvince,
    searchQuery,
    activeLocationId,
    allLocations,
    filteredLocations,
    counts,
    fetchLocations,
    addRegisteredLocation,
    loadLocalLocations,
  };
});
