export type FrameCategory =
  | 'All'
  | 'Eyeglasses'
  | 'Eyeglasses Clip'
  | 'Sunglasses'
  | 'Reading Glasses'
  | 'Sportive'
  | 'Safety'
  | 'Others';

export type FrameGender = 'All' | 'Woman' | 'Man' | 'Kid' | 'Unisex';

export type FrameType = 'All' | 'Full-rim' | 'Half-rim' | 'Rimless';

export type FrameMaterial =
  | 'All'
  | 'Plastic'
  | 'Metal'
  | 'Plastic/Metal'
  | 'Metal/Plastic';

export type FrameKindOfMaterial =
  | 'All'
  | 'Plastic'
  | 'Resin'
  | 'Celluloid'
  | 'Metal'
  | 'Metal Flex'
  | 'Stainless'
  | 'Titanium'
  | 'Mixed'
  | 'Others';

export type FrameShape =
  | 'Rectangle'
  | 'Oval'
  | 'Round'
  | 'Wellington'
  | 'Boston'
  | 'Browline'
  | 'Rimless'
  | 'Other';

export interface FramePicture {
  id?: string;
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface FrameAccessory {
  id?: string;
  name: string;
  isIncluded: boolean;
  picUrl?: string | null;
}

export interface FrameVariant {
  id?: string;
  code: string;
  colorName?: string;
  quantity: number;
  sku?: string;
  picUrl?: string | null;
}

export interface FrameItem {
  id: string;
  wholesalerId?: string | null;
  entryType: 'SINGLE' | 'GROUP';
  brand: string;
  model: string;
  code?: string | null;
  category: FrameCategory;
  gender: FrameGender;
  type: FrameType;
  material: FrameMaterial;
  kindOfMaterial?: FrameKindOfMaterial | null;
  frameShape?: FrameShape | null;
  isPolarized: boolean;
  detail?: string | null;

  // Boxing System
  boxingNotation?: string | null;
  lensWidthA?: number | null;
  lensHeightB?: number | null;
  effectiveDiaEd?: number | null;
  bridgeDbl?: number | null;
  lensDia?: number | null;
  pupillaryDistanceFpd?: number | null;
  frameSize?: 'S' | 'M' | 'L' | 'XL' | null;

  // Inventory & Pricing
  quantity: number;
  price: number;
  wholesalePrice: number;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  createdAt: string;
  updatedAt: string;

  pictures: FramePicture[];
  accessories: FrameAccessory[];
  variants: FrameVariant[];
  wholesaler?: {
    id: string;
    companyName: string;
    phone?: string;
  };
}

export interface CreateFramePayload {
  entryType: 'SINGLE' | 'GROUP';
  brand: string;
  model: string;
  code?: string;
  category: string;
  gender: string;
  type: string;
  material: string;
  kindOfMaterial?: string;
  frameShape?: string;
  isPolarized?: boolean;
  detail?: string;

  boxingNotation?: string;
  lensWidthA?: number;
  lensHeightB?: number;
  effectiveDiaEd?: number;
  bridgeDbl?: number;
  lensDia?: number;
  pupillaryDistanceFpd?: number;
  frameSize?: string;

  quantity: number;
  price?: number;
  wholesalePrice?: number;
  status?: string;

  pictures?: (FramePicture | string)[];
  accessories?: FrameAccessory[];
  variants?: FrameVariant[];
}
