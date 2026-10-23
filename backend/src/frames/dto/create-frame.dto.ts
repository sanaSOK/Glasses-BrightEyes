import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FramePictureDto {
  @ApiProperty({ example: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class FrameAccessoryDto {
  @ApiProperty({ example: 'Case' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isIncluded?: boolean;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67' })
  @IsOptional()
  @IsString()
  picUrl?: string;
}

export class FrameVariantDto {
  @ApiProperty({ example: 'C1' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ example: 'Glossy Black' })
  @IsOptional()
  @IsString()
  colorName?: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ example: 'OLV1201-C1' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  picUrl?: string;
}

export class CreateFrameDto {
  @ApiPropertyOptional({ example: 'SINGLE', enum: ['SINGLE', 'GROUP'], default: 'SINGLE' })
  @IsOptional()
  @IsString()
  entryType?: string; // 'SINGLE' | 'GROUP'

  @ApiProperty({ example: 'Oleva' })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({ example: 'OLV1201' })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiPropertyOptional({ example: 'C4' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'Eyeglasses', default: 'Eyeglasses' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Unisex', default: 'Unisex' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: 'Full-rim', default: 'Full-rim' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'Plastic', default: 'Plastic' })
  @IsOptional()
  @IsString()
  material?: string;

  @ApiPropertyOptional({ example: 'Celluloid' })
  @IsOptional()
  @IsString()
  kindOfMaterial?: string;

  @ApiPropertyOptional({ example: 'Rectangle' })
  @IsOptional()
  @IsString()
  frameShape?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPolarized?: boolean;

  @ApiPropertyOptional({ example: 'High quality optical frame with spring hinges' })
  @IsOptional()
  @IsString()
  detail?: string;

  // Boxing System Measurements
  @ApiPropertyOptional({ example: '52 ▢ 17 – 147' })
  @IsOptional()
  @IsString()
  boxingNotation?: string;

  @ApiPropertyOptional({ example: 52 })
  @IsOptional()
  @IsNumber()
  lensWidthA?: number;

  @ApiPropertyOptional({ example: 38 })
  @IsOptional()
  @IsNumber()
  lensHeightB?: number;

  @ApiPropertyOptional({ example: 58 })
  @IsOptional()
  @IsNumber()
  effectiveDiaEd?: number;

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @IsNumber()
  bridgeDbl?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  lensDia?: number;

  @ApiPropertyOptional({ example: 72 })
  @IsOptional()
  @IsNumber()
  pupillaryDistanceFpd?: number;

  @ApiPropertyOptional({ example: 'M', enum: ['S', 'M', 'L', 'XL'] })
  @IsOptional()
  @IsString()
  frameSize?: string;

  // Quantities & Pricing
  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ example: 85.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 45.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  wholesalePrice?: number;

  @ApiPropertyOptional({ example: 'ACTIVE', default: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  // Relations & Nested payload
  @ApiPropertyOptional({ type: [FramePictureDto] })
  @IsOptional()
  @IsArray()
  pictures?: (FramePictureDto | string)[];

  @ApiPropertyOptional({ type: [FrameAccessoryDto] })
  @IsOptional()
  @IsArray()
  accessories?: FrameAccessoryDto[];

  @ApiPropertyOptional({ type: [FrameVariantDto] })
  @IsOptional()
  @IsArray()
  variants?: FrameVariantDto[];
}
