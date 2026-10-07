import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WholesalersService } from './wholesalers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Wholesalers')
@Controller('wholesalers')
export class WholesalersController {
  constructor(private readonly wholesalersService: WholesalersService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of active wholesalers' })
  async findAll() {
    return this.wholesalersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wholesaler profile details by ID' })
  async findOne(@Param('id') id: string) {
    return this.wholesalersService.findOne(id);
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Get products belonging to a specific wholesaler' })
  async getWholesalerProducts(@Param('id') id: string) {
    return this.wholesalersService.getWholesalerProducts(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.WHOLESALER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own wholesaler company profile' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.wholesalersService.updateProfile(userId, body);
  }
}
