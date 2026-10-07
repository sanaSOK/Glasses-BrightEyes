import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles(Role.WHOLESALER)
  @ApiOperation({ summary: 'Wholesaler view live stock inventory' })
  async getWholesalerInventory(@CurrentUser('id') userId: string) {
    return this.inventoryService.getWholesalerInventory(userId);
  }

  @Patch(':productId')
  @Roles(Role.WHOLESALER)
  @ApiOperation({ summary: 'Wholesaler update stock quantity & low stock threshold' })
  async updateStock(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() body: { quantity: number; lowStockThreshold?: number },
  ) {
    return this.inventoryService.updateStock(
      userId,
      productId,
      body.quantity,
      body.lowStockThreshold,
    );
  }

  @Get('retailer')
  @Roles(Role.RETAILER)
  @ApiOperation({ summary: 'Retailer view own received inventory ledger' })
  async getRetailerInventory(@CurrentUser('id') userId: string) {
    return this.inventoryService.getRetailerInventory(userId);
  }
}
