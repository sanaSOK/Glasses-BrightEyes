import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { DeliveryMethod } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'Phnom Penh Optical Center, St 271, Khan Sen Sok' })
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @ApiProperty({ example: 'Phnom Penh' })
  @IsNotEmpty()
  @IsString()
  province: string;

  @ApiProperty({ example: 'Sen Sok' })
  @IsNotEmpty()
  @IsString()
  district: string;

  @ApiPropertyOptional({ example: 'Teuk Thla' })
  @IsOptional()
  @IsString()
  commune?: string;

  @ApiProperty({ example: '+85512987654' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'Please deliver before 4 PM' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ enum: DeliveryMethod, default: DeliveryMethod.DELIVERY })
  @IsOptional()
  @IsEnum(DeliveryMethod)
  deliveryMethod?: DeliveryMethod;
}
