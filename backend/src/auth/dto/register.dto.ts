import { IsNotEmpty, IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'User Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@brighteyes.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+85512345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 1, description: 'Role: 1 = RETAILER, 2 = WHOLESALER, 3 = SUPER_ADMIN' })
  @IsNotEmpty()
  role: any;

  // Retailer Specific Fields (Role = 1)
  @ApiPropertyOptional({ example: 'Phnom Penh Optical Center' })
  @IsOptional()
  @IsString()
  storeName?: string;

  @ApiPropertyOptional({ example: 'St 271, Khan Sen Sok' })
  @IsOptional()
  @IsString()
  storeAddress?: string;

  // Wholesaler Specific Fields (Role = 2)
  @ApiPropertyOptional({ example: 'Cambodia Optical Wholesale Ltd' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ example: 'Veng Sreng Blvd, Phnom Penh' })
  @IsOptional()
  @IsString()
  businessAddress?: string;

  // Shared Location Details
  @ApiPropertyOptional({ example: 'Phnom Penh' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: 'Khan Toul Kork' })
  @IsOptional()
  @IsString()
  district?: string;
}
