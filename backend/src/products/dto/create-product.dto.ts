import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { ProductType, ProductStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'FRAME-RB-2026-001' })
  @IsNotEmpty()
  @IsString()
  SKU: string;

  @ApiProperty({ example: 'RayBan Wayfarer Classic' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Premium optical eyeglass frames' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'category-uuid' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'RayBan' })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({ enum: ProductType, default: ProductType.FRAME })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiPropertyOptional({ example: 'RB2140' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 'Matte Black' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: '50-22-150' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ example: 'Acetate' })
  @IsOptional()
  @IsString()
  material?: string;

  @ApiPropertyOptional({ example: 'UNISEX' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 120.0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 75.0 })
  @IsNumber()
  @Min(0)
  wholesalePrice: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional({ enum: ProductStatus, default: ProductStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f'] })
  @IsOptional()
  images?: string[];
}
