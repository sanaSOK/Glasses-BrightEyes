import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RetailersService } from './retailers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Retailers')
@Controller('retailers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RetailersController {
  constructor(private readonly retailersService: RetailersService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Admin list of all retailers' })
  async findAll() {
    return this.retailersService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.WHOLESALER)
  @ApiOperation({ summary: 'Get retailer store details by ID' })
  async findOne(@Param('id') id: string) {
    return this.retailersService.findOne(id);
  }

  @Patch('profile')
  @Roles(Role.RETAILER)
  @ApiOperation({ summary: 'Update own retailer store profile' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.retailersService.updateProfile(userId, body);
  }
}
