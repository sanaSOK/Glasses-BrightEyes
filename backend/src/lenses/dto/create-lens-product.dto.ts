import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export class CreateBrandDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}

export class CreateLensProductDto {
  @IsString()
  SKU: string;

  @IsString()
  name: string;

  @IsString()
  brandId: string;

  @IsString()
  lensType: string; // 'Contact Lens', 'Single Vision', 'Bifocal', 'Progressive', 'Sunglass'

  @IsOptional()
  @IsNumber()
  refractiveIndex?: number;

  @IsOptional()
  @IsString()
  coating?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  designType?: string;

  @IsOptional()
  @IsString()
  tintColor?: string;

  @IsOptional()
  @IsString()
  uvProtection?: string;

  @IsOptional()
  @IsBoolean()
  isPolarized?: boolean;

  @IsOptional()
  @IsBoolean()
  antiGlare?: boolean;

  @IsOptional()
  @IsBoolean()
  antiBlueLight?: boolean;

  @IsOptional()
  @IsBoolean()
  scratchResistant?: boolean;

  @IsOptional()
  @IsBoolean()
  emi?: boolean;

  @IsOptional()
  @IsBoolean()
  waterResistant?: boolean;

  @IsOptional()
  @IsBoolean()
  myopiaControl?: boolean;

  @IsOptional()
  @IsNumber()
  baseCurve?: number;

  @IsOptional()
  @IsNumber()
  diameter?: number;

  @IsOptional()
  @IsString()
  waterContent?: string;

  @IsOptional()
  @IsString()
  usageType?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  costPrice: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  minSphere?: number;

  @IsOptional()
  @IsNumber()
  maxSphere?: number;

  @IsOptional()
  @IsNumber()
  sphereStep?: number;

  @IsOptional()
  @IsNumber()
  minCol?: number;

  @IsOptional()
  @IsNumber()
  maxCol?: number;

  @IsOptional()
  @IsNumber()
  colStep?: number;

  @IsOptional()
  @IsArray()
  eyeSides?: string[];
}

export class UpdateVariantCellDto {
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  costPrice?: number;

  @IsOptional()
  @IsNumber()
  sellingPrice?: number;

  @IsOptional()
  @IsString()
  cellColor?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  minStock?: number;

  @IsOptional()
  @IsNumber()
  maxStock?: number;
}

export class BatchUpdateVariantsDto {
  @IsOptional()
  @IsArray()
  variantIds?: string[];

  @IsOptional()
  @IsString()
  lensProductId?: string;

  @IsOptional()
  @IsNumber()
  minSphere?: number;

  @IsOptional()
  @IsNumber()
  maxSphere?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  costPrice?: number;

  @IsOptional()
  @IsNumber()
  sellingPrice?: number;

  @IsOptional()
  @IsString()
  cellColor?: string;
}

export class LensOrderItemDto {
  @IsString()
  lensProductId: string;

  @IsOptional()
  @IsString()
  variantId?: string;

  @IsString()
  productName: string;

  @IsOptional()
  @IsNumber()
  sphere?: number;

  @IsOptional()
  @IsNumber()
  cylinder?: number;

  @IsOptional()
  @IsNumber()
  addPower?: number;

  @IsOptional()
  @IsString()
  eyeSide?: string;

  @IsOptional()
  @IsNumber()
  axis?: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

export class CreateLensOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  items: LensOrderItemDto[];
}

export class OrderFrameDto {
  @IsOptional()
  @IsString()
  frameShape?: string;

  @IsOptional()
  @IsString()
  tracerFlag?: string;

  @IsOptional()
  @IsNumber()
  frameWidthA?: number;

  @IsOptional()
  @IsNumber()
  frameHeightB?: number;

  @IsOptional()
  @IsNumber()
  effectiveDiaEd?: number;

  @IsOptional()
  @IsNumber()
  noseBridgeDbl?: number;

  @IsOptional()
  @IsNumber()
  faceFormAngle?: number;

  @IsOptional()
  @IsNumber()
  pantoscopicTilt?: number;

  @IsOptional()
  @IsNumber()
  refractedBvd?: number;

  @IsOptional()
  @IsNumber()
  fittedBvd?: number;

  @IsOptional()
  @IsNumber()
  baseCurve?: number;

  @IsOptional()
  @IsString()
  frameType?: string;

  @IsOptional()
  @IsNumber()
  vd?: number;

  @IsOptional()
  @IsNumber()
  tilt?: number;

  @IsOptional()
  @IsNumber()
  wrap?: number;

  @IsOptional()
  @IsNumber()
  pdFarR?: number;

  @IsOptional()
  @IsNumber()
  pdFarL?: number;

  @IsOptional()
  @IsNumber()
  pdNearR?: number;

  @IsOptional()
  @IsNumber()
  pdNearL?: number;

  @IsOptional()
  @IsNumber()
  heightR?: number;

  @IsOptional()
  @IsNumber()
  heightL?: number;
}

export class UnifiedOrderLensItemDto {
  @IsOptional()
  @IsString()
  lensType?: string;

  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  designType?: string;

  @IsOptional()
  @IsNumber()
  refractiveIndex?: number;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  tintingType?: string;

  @IsOptional()
  @IsString()
  tintColor?: string;

  @IsOptional()
  @IsString()
  tintFrom?: string;

  @IsOptional()
  @IsString()
  tintTo?: string;

  @IsOptional()
  @IsString()
  gradationPoint?: string;

  @IsOptional()
  @IsString()
  coating?: string;

  @IsOptional()
  @IsString()
  treatments?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsOptional()
  @IsString()
  eyeSide?: string;

  @IsOptional()
  @IsNumber()
  sphere?: number;

  @IsOptional()
  @IsNumber()
  cylinder?: number;

  @IsOptional()
  @IsNumber()
  axis?: number;

  @IsOptional()
  @IsNumber()
  addition?: number;

  @IsOptional()
  @IsNumber()
  diameter?: number;

  @IsOptional()
  @IsNumber()
  dpd?: number;

  @IsOptional()
  @IsNumber()
  npd?: number;

  @IsOptional()
  @IsNumber()
  hPrism?: number;

  @IsOptional()
  @IsString()
  hBase?: string;

  @IsOptional()
  @IsNumber()
  vPrism?: number;

  @IsOptional()
  @IsString()
  vBase?: string;

  @IsOptional()
  @IsNumber()
  fh?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  @IsOptional()
  @IsNumber()
  subtotal?: number;
}

export class CreateUnifiedLensOrderDto {
  @IsOptional()
  @IsString()
  orderNo?: string;

  @IsOptional()
  @IsString()
  orderRef?: string;

  @IsOptional()
  @IsString()
  orderType?: string;

  @IsOptional()
  @IsString()
  buyer?: string;

  @IsOptional()
  @IsString()
  shop?: string;

  @IsOptional()
  @IsString()
  orderingPerson?: string;

  @IsOptional()
  @IsString()
  patientName?: string;

  @IsOptional()
  @IsString()
  patientCode?: string;

  @IsOptional()
  @IsString()
  trayId?: string;

  @IsOptional()
  @IsString()
  orderStatus?: string;

  @IsOptional()
  @IsString()
  orderDate?: string;

  @IsOptional()
  @IsString()
  logisticsDate?: string;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsString()
  accountCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  totalPieces?: number;

  @IsOptional()
  frame?: OrderFrameDto;

  @IsOptional()
  @IsArray()
  items?: UnifiedOrderLensItemDto[];
}

